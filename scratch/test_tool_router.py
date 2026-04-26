
import asyncio
import sys
import os

# Add project root to path
sys.path.append(os.path.abspath("."))

from core.llm.tool_router import tool_router
from loguru import logger

async def test_tool_extraction():
    test_cases = [
        {
            "name": "Markdown JSON",
            "content": "Sure, I'll set the volume for you.\n```json\n{\"tool\": \"set_system_volume\", \"args\": {\"level\": 30}}\n```\nLet me know if you need anything else."
        },
        {
            "name": "Raw JSON with chatter",
            "content": "I'm on it! {\"tool\": \"set_system_volume\", \"args\": {\"level\": 45}} Volume adjusted."
        },
        {
            "name": "Broken JSON (trailing comma)",
            "content": "Fixed JSON: {\"tool\": \"set_system_volume\", \"args\": {\"level\": 50,}}"
        },
        {
            "name": "Multiple objects (take first)",
            "content": "First: {\"tool\": \"get_time\", \"args\": {}} Second: {\"tool\": \"set_system_volume\", \"args\": {\"level\": 10}}"
        }
    ]

    for case in test_cases:
        logger.info(f"Testing: {case['name']}")
        tool_name, tool_result = await tool_router.parse_and_route(case['content'])
        logger.info(f"  Result: tool_name={tool_name}")
        if tool_name:
             logger.success(f"  Successfully extracted: {tool_name}")
        else:
             logger.error(f"  Failed to extract tool from: {case['name']}")
        print("-" * 30)

if __name__ == "__main__":
    asyncio.run(test_tool_extraction())
