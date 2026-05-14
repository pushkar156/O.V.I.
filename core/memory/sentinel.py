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
        Analyzes the recent conversation history to extract facts about the user.
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

# Global instance
sentinel = MemorySentinel()
