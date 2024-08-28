import time
from fastapi import FastAPI
import eigenvector


app = FastAPI()


@app.get("/api/data")
def hello_world():
    return eigenvector.calculate_influence();