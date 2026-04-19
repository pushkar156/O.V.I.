from sqlalchemy import Column, String, DateTime, JSON, ForeignKey, Text
from sqlalchemy.orm import declarative_base, relationship
from datetime import datetime
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Conversation(Base):
    __tablename__ = "conversations"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=True)
    device_source = Column(String, default="desktop") # desktop, laptop, mobile
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    messages = relationship("Message", back_populates="conversation", cascade="all, delete-orphan")

class Message(Base):
    __tablename__ = "messages"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    conversation_id = Column(String, ForeignKey("conversations.id"))
    role = Column(String) # system, user, assistant
    content = Column(Text)
    tool_calls = Column(JSON, nullable=True) # For logging what tools were tried
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    conversation = relationship("Conversation", back_populates="messages")

class Fact(Base):
    """Extracted facts and preferences for long-term memory (Phase 5)."""
    __tablename__ = "facts"
    
    id = Column(String, primary_key=True, default=generate_uuid)
    key = Column(String, index=True) # e.g., "user_name"
    value = Column(String)
    category = Column(String, default="general") # preference, bio, schedule
    created_at = Column(DateTime, default=datetime.utcnow)
