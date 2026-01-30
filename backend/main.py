from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import employees, attendance

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="HRMS Lite API")

# Configure CORS
origins = [
    "http://localhost:5173", # Vite
    "http://localhost:3000",
    "*" # For simpler testing/deployment initially
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employees.router)
app.include_router(attendance.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to HRMS Lite API"}
