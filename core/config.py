import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Server Configuration
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    LOG_LEVEL: str = "INFO"

    # LLM Configuration
    OLLAMA_URL: str = "http://localhost:11434"
    DEFAULT_MODEL: str = "qwen3:8b"

    # Memory Configuration
    MEMORY_DB_PATH: str = "./data/ovi.db"
    CHROMA_PERSIST_DIR: str = "./data/chroma"

    # Environment variables configuration
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
