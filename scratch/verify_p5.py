
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath("."))

from core.memory.long_term import long_term_memory
from loguru import logger

async def verify_memory_and_personality():
    logger.info("Verifying Memory & Personality systems...")

    # 1. Test Memory Storage
    test_fact = "My favorite programming language is Python and I love JARVIS."
    logger.info(f"Storing fact: {test_fact}")
    await long_term_memory.store_memory(test_fact, category="user_preference")
    
    # Wait a moment for ChromaDB to flush (though it's persistent)
    await asyncio.sleep(1)
    
    # 2. Test Memory Recall
    query = "What is my favorite language?"
    logger.info(f"Recalling for query: {query}")
    memories = await long_term_memory.recall(query, limit=1)
    
    if memories:
        logger.success(f"Recalled: {memories[0]['content']}")
    else:
        logger.error("Recall failed. Memory might not be persisting correctly in this environment.")

    # 3. Test Persona Components
    from core.personality.persona import persona_manager
    greeting = persona_manager.get_greeting(device_count=2)
    logger.info(f"Generated Greeting: {greeting}")
    
    prompt = persona_manager.get_personality_prompt()
    logger.info("Personality Prompt Header:")
    print(prompt[:200] + "...")

if __name__ == "__main__":
    asyncio.run(verify_memory_and_personality())
