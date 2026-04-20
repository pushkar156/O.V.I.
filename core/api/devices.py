from fastapi import APIRouter
import psutil
import time
import os
from datetime import datetime

router = APIRouter(prefix="/api", tags=["Devices"])

# Global start time for O.V.I. uptime
START_TIME = time.time()

@router.get("/system/stats")
async def get_system_stats():
    """Returns live hardware telemetry for the dashboard."""
    
    # Calculate Uptime
    uptime_seconds = int(time.time() - START_TIME)
    hours, remainder = divmod(uptime_seconds, 3600)
    minutes, _ = divmod(remainder, 60)
    uptime_str = f"{hours}h {minutes}m"

    # Gather RAM data
    ram = psutil.virtual_memory()
    
    # Gather Disk data
    disk = psutil.disk_usage("/")
    
    # Gather Network data
    net_io = psutil.net_io_counters()

    # Gather Battery data (if available)
    battery = psutil.sensors_battery()
    battery_info = {
        "percent": battery.percent if battery else 100,
        "plugged": battery.power_plugged if battery else True
    }

    return {
        "cpu": psutil.cpu_percent(interval=1),
        "ram": {
            "used": round(ram.used / (1024**3), 2),
            "total": round(ram.total / (1024**3), 2),
            "percent": ram.percent
        },
        "disk": {
            "used": round(disk.used / (1024**3), 2),
            "total": round(disk.total / (1024**3), 2),
            "percent": disk.percent
        },
        "network": {
            "bytes_sent": net_io.bytes_sent,
            "bytes_recv": net_io.bytes_recv
        },
        "battery": battery_info,
        "uptime": uptime_str,
        "process_count": len(psutil.pids())
    }

@router.get("/devices")
async def list_devices():
    """Returns a list of agents in the O.V.I. Neural Mesh."""
    return [
        {
            "name": "OVI-Host (Desktop)",
            "status": "online",
            "ip": "127.0.0.1",
            "capabilities": ["voice", "vision", "automation", "filesystem"],
            "last_seen": datetime.utcnow().isoformat(),
            "latency_ms": 1
        }
    ]
