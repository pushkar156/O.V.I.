import os
import subprocess
import hashlib
import sys

def get_file_hash(filepath):
    if not os.path.exists(filepath):
        return None
    with open(filepath, 'rb') as f:
        return hashlib.md5(f.read()).hexdigest()

def sync_python():
    print("[1/2] Checking Python dependencies...")
    req_file = 'requirements.txt'
    hash_file = '.venv_hash'
    
    current_hash = get_file_hash(req_file)
    stored_hash = None
    if os.path.exists(hash_file):
        with open(hash_file, 'r') as f:
            stored_hash = f.read().strip()
            
    if current_hash != stored_hash:
        print("      Changes detected. Syncing venv...")
        # Use venv python
        python_exe = os.path.join('venv', 'Scripts', 'python.exe')
        if not os.path.exists(python_exe):
            print("      ERROR: venv not found! Please create it first.")
            return False
            
        try:
            subprocess.check_call([python_exe, '-m', 'pip', 'install', '-r', req_file, '--quiet'])
            with open(hash_file, 'w') as f:
                f.write(current_hash)
            print("      Python venv synced.")
        except Exception as e:
            print(f"      ERROR syncing venv: {e}")
            return False
    else:
        print("      Python venv is up to date.")
    return True

def sync_node():
    print("[2/2] Checking Node dependencies...")
    # Root
    if not os.path.exists('node_modules'):
        print("      Root node_modules missing. Installing...")
        subprocess.check_call(['npm', 'install', '--quiet'], shell=True)
    
    # Dashboard
    dash_dir = 'dashboard'
    if os.path.exists(dash_dir) and not os.path.exists(os.path.join(dash_dir, 'node_modules')):
        print("      Dashboard node_modules missing. Installing...")
        subprocess.check_call(['npm', 'install', '--quiet'], cwd=dash_dir, shell=True)
    
    print("      Node dependencies checked.")
    return True

if __name__ == "__main__":
    success = sync_python() and sync_node()
    if not success:
        sys.exit(1)
    print("\n[SUCCESS] Environment integrity verified.\n")
