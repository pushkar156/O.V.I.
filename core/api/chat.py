from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from loguru import logger

from core.llm.ollama_client import ollama_client
from core.llm.prompt_builder import prompt_builder
from core.llm.tool_router import tool_router
from core.tools import get_tool_definitions

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
    
    # 1. Prepare context and instructions
    tool_defs = get_tool_definitions()
    system_prompt = prompt_builder.build_system_prompt(tools=tool_defs, context=request.context)
    
    messages = [
        {"role": "system", "content": system_prompt},
        # TODO: Load actual conversation history from memory in Phase 5
        {"role": "user", "content": request.message}
    ]
    
    tools_used = []
    
    try:
        # 2. First Pass: Get intent from LLM
        response_msg = await ollama_client.chat(messages)
        content = response_msg.get("content", "")
        
        # 3. Handle Tool Calls
        tool_name, tool_result = await tool_router.parse_and_route(content)
        
        if tool_name:
            logger.info(f"Tool execution detected: {tool_name}")
            
            # Record tool usage
            tools_used.append(ToolUsage(
                name=tool_name,
                args={}, # Arguments can be extracted if needed for logging
                success=tool_result.success if hasattr(tool_result, 'success') else True,
                result=tool_result
            ))
            
            # 4. Second Pass: Feed tool result back to LLM for final response
            messages.append({"role": "assistant", "content": content})
            messages.append({
                "role": "system", 
                "content": f"Tool '{tool_name}' returned: {tool_result}. Now explain this to the user."
            })
            
            final_response = await ollama_client.chat(messages)
            content = final_response.get("content", "")

        return ChatResponse(
            response=content,
            tools_used=tools_used,
            conversation_id=request.conversation_id or "default-session"
        )
        
    except Exception as e:
        logger.error(f"Error in chat endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))
