import os
import sys
import winreg
from loguru import logger

def add_to_startup():
    """Adds O.V.I. to Windows Startup via the Registry."""
    # Path to the launcher batch file
    launcher_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "launch_ovi.bat"))
    
    if not os.path.exists(launcher_path):
        logger.error(f"Launcher not found at {launcher_path}")
        return False

    try:
        # Open the Run key
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_SET_VALUE
        )
        
        # Set the value (O.V.I. as the name, path to the batch file as the value)
        # Using cmd /c to run the batch file hidden if needed, but for now just the path
        winreg.SetValueEx(key, "OVI_Assistant", 0, winreg.REG_SZ, f'"{launcher_path}"')
        winreg.CloseKey(key)
        
        logger.success("O.V.I. successfully added to Windows Startup.")
        return True
    except Exception as e:
        logger.error(f"Failed to add to startup: {e}")
        return False

def remove_from_startup():
    """Removes O.V.I. from Windows Startup."""
    try:
        key = winreg.OpenKey(
            winreg.HKEY_CURRENT_USER,
            r"Software\Microsoft\Windows\CurrentVersion\Run",
            0,
            winreg.KEY_SET_VALUE
        )
        winreg.DeleteValue(key, "OVI_Assistant")
        winreg.CloseKey(key)
        logger.success("O.V.I. removed from Windows Startup.")
        return True
    except FileNotFoundError:
        logger.warning("O.V.I. was not in startup.")
        return True
    except Exception as e:
        logger.error(f"Failed to remove from startup: {e}")
        return False

if __name__ == "__main__":
    if len(sys.argv) > 1:
        command = sys.argv[1].lower()
        if command == "--enable":
            add_to_startup()
        elif command == "--disable":
            remove_from_startup()
        else:
            print("Usage: python manage_startup.py [--enable | --disable]")
    else:
        # Default behavior: show status or help
        print("Usage: python manage_startup.py [--enable | --disable]")
