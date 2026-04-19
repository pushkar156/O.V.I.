from abc import ABC, abstractmethod
from typing import Dict, Any, Optional
from pydantic import BaseModel

class ToolResult(BaseModel):
    """Standardized result format for all tools."""
    success: bool
    data: Optional[Any] = None
    message: str

class BaseTool(ABC):
    """
    Base class for all O.V.I. tools.
    Each tool must define its name, description, and required parameters.
    """
    @property
    @abstractmethod
    def name(self) -> str:
        """The identifier used by the LLM to call this tool."""
        pass

    @property
    @abstractmethod
    def description(self) -> str:
        """A clear description of what the tool does (used in the prompt)."""
        pass

    @property
    @abstractmethod
    def parameters(self) -> Dict[str, Any]:
        """JSON schema defining the expected input arguments."""
        pass

    @abstractmethod
    async def execute(self, **kwargs) -> ToolResult:
        """Main logic for the tool execution."""
        pass

    def get_llm_definition(self) -> Dict[str, Any]:
        """Returns the tool definition in a format the LLM can understand."""
        return {
            "name": self.name,
            "description": self.description,
            "parameters": self.parameters
        }
