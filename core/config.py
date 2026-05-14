import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    # Server Configuration
    SERVER_HOST: str = "0.0.0.0"
    SERVER_PORT: int = 8000
    LOG_LEVEL: str = "INFO"
    OVI_TOKEN: str = "ovi-dev-token" # Default for local dev, override in .env

    # LLM Configuration
    OLLAMA_URL: str = "http://127.0.0.1:11434"
    DEFAULT_MODEL: str = "qwen2.5:1.5b"
    # Voice & Audio
    FFMPEG_PATH: str = r"E:\ffmpeg-2026-05-11-git-17bc88e67f-full_build\bin"
    DEFAULT_VOICE: str = "en-US-AvaNeural"

    # Memory Configuration
    MEMORY_DB_PATH: str = "./data/ovi.db"
    CHROMA_PERSIST_DIR: str = "./data/chroma"

    # Environment variables configuration
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
