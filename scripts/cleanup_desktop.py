import os
import shutil
from pathlib import Path
from loguru import logger

def cleanup_desktop():
    desktop = Path(os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop'))
    archive_dir = desktop / "OVI_Archive"
    
    if not archive_dir.exists():
        archive_dir.mkdir()
        logger.info(f"Created archive directory: {archive_dir}")

    # File types to move
    extensions = ['.pdf', '.docx', '.jpg', '.png', '.zip', '.txt']
    
    count = 0
    for item in desktop.iterdir():
        if item.is_file() and item.suffix.lower() in extensions:
            try:
                shutil.move(str(item), str(archive_dir / item.name))
                count += 1
            except Exception as e:
                logger.error(f"Failed to move {item.name}: {e}")
                
    logger.info(f"Moved {count} files to OVI_Archive.")

if __name__ == "__main__":
    cleanup_desktop()
