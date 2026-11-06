import asyncio
from loguru import logger
from typing import List, Dict, Any
from core.llm.ollama_client import ollama_client
from core.memory.long_term import long_term_memory
from core.memory.short_term import memory_manager

class MemorySentinel:
    """
    Background intelligence that watches conversations and extracts facts.
    This is O.V.I.'s 'subconscious' layer.
    """
    
    async def extract_facts(self, conversation_id: str):
        """
        Background task to extract facts from the last message pair.
        """
        try:
            # 1. Get recent context
            history = await memory_manager.get_history(conversation_id, limit=10)
            if not history:
                return

            # 2. Prepare the extraction prompt
            chat_summary = "\n".join([f"{m['role']}: {m['content']}" for m in history])
            
            prompt = f"""
            Task: Extract specific facts or preferences about the user from the following conversation history.
            Focus on: Personal details, project names, technical preferences, schedule items, or life events.
            Format: Return a simple list of facts, one per line. If no new facts are found, return 'NONE'.
            
            Conversation History:
            {chat_summary}
            
            Extracted Facts:
            """
            
            # 3. Use LLM to extract facts
            response = await ollama_client.generate(
                prompt=prompt, 
                system="You are O.V.I.'s memory processing unit. Your job is to extract factual data to store in long-term memory."
            )
            
            if "NONE" in response.upper() or not response.strip():
                return
                
            # 4. Parse and store in ChromaDB
            facts = [f.strip("- ").strip() for f in response.split("\n") if f.strip() and len(f.strip()) > 5]
            
            for fact in facts:
                # Avoid storing Meta-conversation facts like "I am an AI"
                if "O.V.I." in fact and "you are" in fact.lower():
                    continue
                    
                await long_term_memory.store_memory(
                    text=fact, 
                    category="fact",
                    metadata={"source_conversation": conversation_id}
                )
                
            logger.info(f"Sentinel extracted {len(facts)} facts from conversation {conversation_id}")
            
        except Exception as e:
            logger.error(f"Memory Sentinel failed to extract facts: {e}")

    async def get_proactive_context(self, query: str) -> str:
        """
        Finds relevant facts from long-term memory to inject into the current prompt.
        This implements Phase 3.3 (Proactive Memory).
        """
        try:
            memories = await long_term_memory.recall(query, limit=3)
            if not memories:
                return ""
                
            context_blocks = [m['content'] for m in memories]
            return "\n[RECALLED CONTEXT]:\n" + "\n".join(context_blocks)
        except Exception as e:
            logger.error(f"Sentinel failed to get proactive context: {e}")
            return ""

    async def generate_intelligent_title(self, conversation_id: str, user_msg: str, ai_msg: str):
        """
        Generates a 2-4 word title for the conversation based on the initial exchange.
        """
        try:
            # Only rename if it's currently a snippet or 'New Chat'
            conversations = await memory_manager.get_conversations()
            current_conv = next((c for c in conversations if c['id'] == conversation_id), None)
            
            # If the title is longer than 30 chars or doesn't look like a snippet, skip
            if current_conv and len(current_conv['title']) < 30 and "..." not in current_conv['title']:
                logger.info(f"Skipping auto-rename for {conversation_id}: Title '{current_conv['title']}' seems intentional.")
                return

            prompt = f"""
            Task: Generate a brief (2-4 words) title for this conversation.
            User: {user_msg}
            AI: {ai_msg}
            
            Return ONLY the title. No quotes, no preamble.
            """
            
            title = await ollama_client.generate(prompt, system="You are O.V.I.'s librarian.")
            title = title.strip().replace('"', '').replace('.', '')
            
            # Update the session title in the short-term memory
            await memory_manager.update_conversation_title(conversation_id, title)
            logger.info(f"Sentinel named conversation {conversation_id} as: '{title}'")
        except Exception as e:
            logger.error(f"Sentinel naming failed: {e}")

# Global instance
sentinel = MemorySentinel()
