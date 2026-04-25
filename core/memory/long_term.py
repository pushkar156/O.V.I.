import chromadb
from chromadb.config import Settings
import time
from typing import List, Dict, Any, Optional
from loguru import logger
import os

from core.llm.ollama_client import ollama_client

class LongTermMemory:
    """
    Manages semantic memory using ChromaDB.
    Stores facts, preferences, and conversation summaries.
    """
    def __init__(self, persist_directory: str = "./data/chroma"):
        self.persist_directory = persist_directory
        if not os.path.exists(persist_directory):
            os.makedirs(persist_directory, exist_ok=True)
            
        self.client = chromadb.PersistentClient(path=persist_directory)
        
        # Create or get collections
        # 'memories' for general facts and preferences
        # 'knowledge' for file/document content
        self.memories = self.client.get_or_create_collection(
            name="memories",
            metadata={"hnsw:space": "cosine"}
        )
        self.knowledge = self.client.get_or_create_collection(
            name="knowledge",
            metadata={"hnsw:space": "cosine"}
        )

    async def store_memory(self, text: str, category: str = "fact", metadata: Dict[str, Any] = {}):
        """Embed and store a memory snippet."""
        try:
            vector = await ollama_client.get_embeddings(text)
            if not vector:
                return
                
            mem_id = f"{category}_{int(time.time())}"
            final_metadata = {
                "category": category,
                "timestamp": time.time(),
                **metadata
            }
            
            self.memories.add(
                ids=[mem_id],
                embeddings=[vector],
                documents=[text],
                metadatas=[final_metadata]
            )
            logger.info(f"Stored {category} memory: {text[:50]}...")
        except Exception as e:
            logger.error(f"Failed to store memory: {e}")

    async def recall(self, query: str, limit: int = 5) -> List[Dict[str, Any]]:
        """Find semantically similar memories."""
        try:
            vector = await ollama_client.get_embeddings(query)
            if not vector:
                return []
                
            results = self.memories.query(
                query_embeddings=[vector],
                n_results=limit
            )
            
            memories = []
            if results['documents']:
                for i in range(len(results['documents'][0])):
                    memories.append({
                        "content": results['documents'][0][i],
                        "metadata": results['metadatas'][0][i] if results['metadatas'] else {},
                        "distance": results['distances'][0][i] if results['distances'] else 0
                    })
            return memories
        except Exception as e:
            logger.error(f"Failed to recall memories: {e}")
            return []

    async def store_document_chunk(self, text: str, file_path: str, chunk_idx: int):
        """Store a chunk of a file for RAG."""
        try:
            vector = await ollama_client.get_embeddings(text)
            if not vector:
                return
                
            doc_id = f"{file_path}_{chunk_idx}"
            self.knowledge.add(
                ids=[doc_id],
                embeddings=[vector],
                documents=[text],
                metadatas=[{"file_path": file_path, "chunk": chunk_idx}]
            )
        except Exception as e:
            logger.error(f"Failed to store document chunk: {e}")

    async def query_knowledge(self, query: str, limit: int = 3) -> List[str]:
        """Search across stored documents/files."""
        try:
            vector = await ollama_client.get_embeddings(query)
            if not vector:
                return []
                
            results = self.knowledge.query(
                query_embeddings=[vector],
                n_results=limit
            )
            return results['documents'][0] if results['documents'] else []
        except Exception as e:
            logger.error(f"Failed to query knowledge: {e}")
            return []

# Global instance
long_term_memory = LongTermMemory()
