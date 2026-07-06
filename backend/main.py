from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import get_scorecard, get_fighter

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(get_fighter.router)
app.include_router(get_scorecard.router)
