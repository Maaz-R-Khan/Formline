# app.py
from pathlib import Path
from fastapi import FastAPI, WebSocket
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

BASE_DIR = Path(__file__).parent
DIST_DIR = BASE_DIR / "../frontend/dist"

app = FastAPI()

app.mount("/assets", StaticFiles(directory=DIST_DIR / "assets"), name="assets")

@app.get("/ping")
def ping():
    return {"status": "ok"}

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    
    try:
        while True:
            data = await websocket.receive_text()
            
            await websocket.send_text(f"Message received: {data}")
    except Exception as e:
        print(f"Connection closed: {e}")

@app.get("/{full_path:path}")
async def serve_spa(full_path: str):
    return FileResponse(DIST_DIR / "index.html")
