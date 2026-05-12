from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from loguru import logger
import os

from core.config import settings
from core.memory.schema import Base

# Ensure the data directory exists
os.makedirs(os.path.dirname(settings.MEMORY_DB_PATH), exist_ok=True)

# Create async engine for SQLite (using aiosqlite)
# Prefix sqlite with +aiosqlite for async support
SQLALCHEMY_DATABASE_URL = f"sqlite+aiosqlite:///{settings.MEMORY_DB_PATH}"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False} # Needed for SQLite + FastAPI
)

AsyncSessionLocal = sessionmaker(
    engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

async def init_db():
    """Initializes the database, creating all tables if they don't exist."""
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info(f"Database initialized at {settings.MEMORY_DB_PATH}")
    except Exception as e:
        logger.error(f"Failed to initialize database: {e}")

async def get_db():
    """Dependency for getting an async database session."""
    async with AsyncSessionLocal() as session:
        yield session

async def close_db():
    """Closes the database engine connections."""
    try:
        await engine.dispose()
        logger.info("Database engine disposed.")
    except Exception as e:
        logger.error(f"Error disposing database engine: {e}")
