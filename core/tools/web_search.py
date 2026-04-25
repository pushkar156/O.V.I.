import httpx
from typing import Dict, Any, List
from loguru import logger

class AdvancedSearchTool:
    name = "perform_advanced_search"
    description = "Searches the web and returns a summary of results for O.V.I. to read."
    
    def __init__(self, searxng_url: str = "http://localhost:8080"):
        self.searxng_url = searxng_url

    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "query": {"type": "string", "description": "The search query."}
                },
                "required": ["query"]
            }
        }

    async def execute(self, args: Dict[str, Any]) -> str:
        query = args.get("query")
        try:
            logger.info(f"Performing advanced search for: {query}")
            
            # Try SearXNG first (Local/Self-hosted)
            async with httpx.AsyncClient(timeout=10) as client:
                response = await client.get(
                    f"{self.searxng_url}/search",
                    params={
                        "q": query,
                        "format": "json",
                        "engines": "google,duckduckgo,wikipedia"
                    }
                )
                
                if response.status_code == 200:
                    data = response.json()
                    results = data.get("results", [])[:5] # Top 5 results
                    
                    if not results:
                        return "No results found for that query."
                        
                    formatted_results = []
                    for res in results:
                        title = res.get("title", "No Title")
                        content = res.get("content", "No snippet available.")
                        url = res.get("url", "")
                        formatted_results.append(f"Source: {title}\nContent: {content}\nLink: {url}")
                        
                    return "\n\n".join(formatted_results)
                
                return "Search service is currently unavailable. Please try again later or check your local SearXNG instance."
                
        except Exception as e:
            logger.error(f"Advanced search failed: {e}")
            return f"Search failed: {e}. (Is SearXNG running at {self.searxng_url}?)"

# Instance for registry
advanced_search_tool = AdvancedSearchTool()
