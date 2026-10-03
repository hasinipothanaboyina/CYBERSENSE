from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.endpoints import auth, users, submissions, analyze, training, admin, notifications
from app.database.session import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(title="PhishGuard AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(users.router, prefix="/users", tags=["users"])
app.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
app.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
app.include_router(training.router, prefix="/training", tags=["training"])
app.include_router(admin.router, prefix="/admin", tags=["admin"])
app.include_router(notifications.router, prefix="/notifications", tags=["notifications"])

@app.get("/")
def root():
    return {"message": "PhishGuard AI API is running"}
