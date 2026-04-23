from sqlalchemy.future import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Dict, Any, Optional
from loguru import logger

from core.memory.database import AsyncSessionLocal
from core.memory.schema import Conversation, Message

class ShortTermMemory:
    """
    Manages active conversation history.
    Provides methods to persist messages and retrieve context windows for the LLM.
    """
    
    async def add_message(self, conversation_id: str, role: str, content: str, tool_calls: Optional[dict] = None):
        """Persists a new message to the database."""
        async with AsyncSessionLocal() as session:
            try:
                # 1. Ensure conversation exists
                stmt = select(Conversation).where(Conversation.id == conversation_id)
                result = await session.execute(stmt)
                conv = result.scalar_one_or_none()
                
                if not conv:
                    title = content[:25] + "..." if len(content) > 25 else content
                    conv = Conversation(id=conversation_id, title=title)
                    session.add(conv)
                
                # 2. Add message
                msg = Message(
                    conversation_id=conversation_id,
                    role=role,
                    content=content,
                    tool_calls=tool_calls
                )
                session.add(msg)
                await session.commit()
            except Exception as e:
                logger.error(f"Failed to add message to memory: {e}")
                await session.rollback()

    async def get_history(self, conversation_id: str, limit: int = 10) -> List[Dict[str, str]]:
        """Retrieves the last N messages for a conversation as a list of dicts."""
        async with AsyncSessionLocal() as session:
            try:
                stmt = (
                    select(Message)
                    .where(Message.conversation_id == conversation_id)
                    .order_by(Message.timestamp.desc())
                    .limit(limit)
                )
                result = await session.execute(stmt)
                messages = result.scalars().all()
                
                # Return in chronological order
                return [
                    {"role": msg.role, "content": msg.content} 
                    for msg in reversed(messages)
                ]
            except Exception as e:
                logger.error(f"Failed to retrieve history: {e}")
                return []

    async def get_conversations(self) -> List[Dict[str, Any]]:
        """Retrieves a list of all conversations."""
        async with AsyncSessionLocal() as session:
            try:
                stmt = select(Conversation).order_by(Conversation.created_at.desc())
                result = await session.execute(stmt)
                conversations = result.scalars().all()
                
                return [
                    {
                        "id": conv.id,
                        "title": conv.title,
                        "created_at": conv.created_at.isoformat() if conv.created_at else None
                    }
                    for conv in conversations
                ]
            except Exception as e:
                logger.error(f"Failed to list conversations: {e}")
                return []

    async def update_conversation_title(self, conversation_id: str, new_title: str):
        """Updates the title of an existing conversation."""
        async with AsyncSessionLocal() as session:
            try:
                stmt = select(Conversation).where(Conversation.id == conversation_id)
                result = await session.execute(stmt)
                conv = result.scalar_one_or_none()
                if conv:
                    conv.title = new_title
                    await session.commit()
            except Exception as e:
                logger.error(f"Failed to update conversation title: {e}")
                await session.rollback()

    async def delete_conversation(self, conversation_id: str):
        """Deletes a conversation and all its messages."""
        async with AsyncSessionLocal() as session:
            try:
                # SQLAlchemy's cascade should handle messages if configured, 
                # but we'll do it explicitly if needed or rely on schema.
                from sqlalchemy import delete
                stmt = delete(Conversation).where(Conversation.id == conversation_id)
                await session.execute(stmt)
                await session.commit()
            except Exception as e:
                logger.error(f"Failed to delete conversation: {e}")
                await session.rollback()

# Global instance
memory_manager = ShortTermMemory()
