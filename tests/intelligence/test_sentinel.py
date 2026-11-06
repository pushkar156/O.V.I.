import pytest
import asyncio
from unittest.mock import MagicMock, patch, AsyncMock
from core.memory.sentinel import sentinel
from core.memory.long_term import long_term_memory

@pytest.mark.asyncio
async def test_sentinel_fact_extraction():
    """Test that sentinel correctly extracts facts from chat history."""
    conv_id = "test_conv_123"
    
    # Mock history
    mock_history = [
        {"role": "user", "content": "Hi OVI, I'm Pushkar. I really like dark mode and I'm working on a project called Sentinel."},
        {"role": "assistant", "content": "Hello Pushkar! I've noted that you prefer dark mode and are developing Project Sentinel. How can I help?"}
    ]
    
    # Mock LLM response
    mock_llm_response = "- Pushkar prefers dark mode\n- Pushkar is working on Project Sentinel"
    
    with patch('core.memory.short_term.memory_manager.get_history', new_callable=AsyncMock) as mock_get_hist, \
         patch('core.llm.ollama_client.ollama_client.generate', new_callable=AsyncMock) as mock_gen, \
         patch('core.memory.long_term.long_term_memory.store_memory', new_callable=AsyncMock) as mock_store:
        
        mock_get_hist.return_value = mock_history
        mock_gen.return_value = mock_llm_response
        
        await sentinel.extract_facts(conv_id)
        
        # Verify
        assert mock_gen.called
        assert mock_store.call_count == 2
        
        # Check first fact
        first_call_args = mock_store.call_args_list[0]
        assert "dark mode" in first_call_args[1]['text']

@pytest.mark.asyncio
async def test_sentinel_proactive_context():
    """Test that sentinel pulls relevant context for a query."""
    query = "What projects am I working on?"
    mock_memories = [
        {"content": "Pushkar is working on Project Sentinel", "metadata": {}}
    ]
    
    with patch('core.memory.long_term.long_term_memory.recall', new_callable=AsyncMock) as mock_recall:
        mock_recall.return_value = mock_memories
        
        context = await sentinel.get_proactive_context(query)
        
        assert "Project Sentinel" in context
        assert "[RECALLED CONTEXT]" in context
