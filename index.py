from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="frontend/build/static"), name="static")

@app.get("/")
def root():
    return FileResponse("frontend/build/index.html")


@app.get("/favicon.ico")
@app.get("/logo.png")
def logo():
    return FileResponse("frontend/build/logo.png")


@app.get("/manifest.json")
def manifest():
    return FileResponse("frontend/build/manifest.json")
