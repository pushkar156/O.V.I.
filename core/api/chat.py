from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from loguru import logger

from core.llm.ollama_client import ollama_client
from core.llm.prompt_builder import prompt_builder
from core.llm.tool_router import tool_router
from core.tools import get_tool_definitions
from core.memory.short_term import memory_manager
from core.agents.agent_registry import agent_registry

router = APIRouter(prefix="/api/chat", tags=["Chat"])

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    context: Optional[Dict[str, Any]] = None

class ToolUsage(BaseModel):
    name: str
    args: Dict[str, Any]
    success: bool
    result: Any

class ChatResponse(BaseModel):
    response: str
    tools_used: List[ToolUsage]
    conversation_id: str

@router.post("", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main entry point for text-based commands.
    Processes intent, executes tools, and returns a natural language response.
    """
    logger.info(f"Received chat request: {request.message}")
    import uuid
    # If no ID provided, try to find the most recent active session for this 'user'
    # For now, we'll stick to a stricter check: if not provided, generate ONE and keep it.
    conv_id = request.conversation_id
    if not conv_id:
        # Check if we have an 'active' session in memory we can reuse? 
        # For simplicity, we'll let the frontend handle the 'stickiness' better.
        conv_id = str(uuid.uuid4())
    
    # 1. Prepare context and instructions
    context = request.context or {}
    
    # Inject live agents into context
    online_agents = agent_registry.get_online_agents()
    context["agents"] = online_agents
    context["agent_count"] = len(online_agents)
    
    tool_defs = get_tool_definitions()
    system_prompt = prompt_builder.build_system_prompt(tools=tool_defs, context=context)
    
    # 2. Load History
    history = await memory_manager.get_history(conv_id)
    
    messages = [{"role": "system", "content": system_prompt}]
    messages.extend(history)
    messages.append({"role": "user", "content": request.message})
    
    # 3. Persist User Message
    await memory_manager.add_message(conv_id, "user", request.message)
    
    tools_used = []
    
    try:
        # 4. First Pass: Get intent from LLM
        response_msg = await ollama_client.chat(messages)
        content = response_msg.get("content", "")
        
        # 5. Handle Tool Calls
        tool_name, tool_result = await tool_router.parse_and_route(content)
        
        if tool_name:
            logger.info(f"Tool execution detected: {tool_name}")
            
            # Record tool usage
            tools_used.append(ToolUsage(
                name=tool_name,
                args={}, 
                success=tool_result.success if hasattr(tool_result, 'success') else True,
                result=tool_result
            ))
            
            # 6. Second Pass: Feed tool result back to LLM for final response
            messages.append({"role": "assistant", "content": content})
            messages.append({
                "role": "system", 
                "content": f"Tool '{tool_name}' returned: {tool_result}. Now explain this to the user."
            })
            
            final_response = await ollama_client.chat(messages)
            content = final_response.get("content", "")

        # 7. Persist Assistant Response
        await memory_manager.add_message(conv_id, "assistant", content)

        return ChatResponse(
            response=content,
            tools_used=tools_used,
            conversation_id=conv_id
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sessions")
async def get_chat_sessions():
    """Retrieve all past chat conversations."""
    conversations = await memory_manager.get_conversations()
    return conversations

@router.get("/history/{conversation_id}")
async def get_chat_history(conversation_id: str):
    """Retrieve message history for a specific conversation."""
    history = await memory_manager.get_history(conversation_id, limit=50)
    return history

class UpdateTitleRequest(BaseModel):
    title: str

@router.patch("/sessions/{conversation_id}")
async def update_session_title(conversation_id: str, request: UpdateTitleRequest):
    """Update the title of a conversation."""
    await memory_manager.update_conversation_title(conversation_id, request.title)
    return {"status": "success"}

@router.delete("/sessions/{conversation_id}")
async def delete_session(conversation_id: str):
    """Delete a conversation."""
    await memory_manager.delete_conversation(conversation_id)
    return {"status": "success"}
