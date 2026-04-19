import httpx
import asyncio
import json
from loguru import logger

BASE_URL = "http://localhost:8000"

async def test_health():
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}/health")
        print(f"\n[1] Health Check: {response.status_code}")
        print(json.dumps(response.json(), indent=2))
        return response.status_code == 200

async def test_chat_time():
    payload = {"message": "What time is it?"}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/api/chat", json=payload, timeout=30.0)
        print(f"\n[2] Time Query: {response.status_code}")
        result = response.json()
        print(f"O.V.I. Response: {result['response']}")
        print(f"Tools Used: {[t['name'] for t in result['tools_used']]}")
        return len(result['tools_used']) > 0

async def test_chat_system():
    payload = {"message": "How much RAM am I using?"}
    async with httpx.AsyncClient() as client:
        response = await client.post(f"{BASE_URL}/api/chat", json=payload, timeout=30.0)
        print(f"\n[3] System Info Query: {response.status_code}")
        result = response.json()
        print(f"O.V.I. Response: {result['response']}")
        return len(result['tools_used']) > 0

async def run_all_tests():
    print("=== O.V.I. Phase 1 Verification ===")
    try:
        if await test_health():
            await test_chat_time()
            await test_chat_system()
            print("\n✅ Phase 1 Verification Complete!")
        else:
            print("\n❌ Server is not running. Start it with 'python -m core.main'")
    except Exception as e:
        print(f"\n❌ Verification Error: {e}")

if __name__ == "__main__":
    asyncio.run(run_all_tests())
