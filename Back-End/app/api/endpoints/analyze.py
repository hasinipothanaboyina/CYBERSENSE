from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from app.api.deps import get_current_user
from app.models.user import User
from app.analyzers.url_analyzer import analyze_url_service

router = APIRouter()

class UrlRequest(BaseModel):
    url: str

@router.post("/url")
def analyze_url(req: UrlRequest, current_user: User = Depends(get_current_user)):
    result = analyze_url_service(req.url)
    return result
