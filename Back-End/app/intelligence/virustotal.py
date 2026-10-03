import os

def check_hash(file_hash: str):
    api_key = os.getenv("VIRUSTOTAL_API_KEY")
    if not api_key:
        return {"status": "unavailable"}
    return {"status": "unknown"}
