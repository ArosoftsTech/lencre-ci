import os
from fastapi import FastAPI, BackgroundTasks, HTTPException
from pydantic import BaseModel
from typing import Optional
from dotenv import load_dotenv
from worker import analyze_article_task
import uuid

load_dotenv()

app = FastAPI(title="Lencre AI Analysis Service")

class ArticlePayload(BaseModel):
    article_id: int
    title: str
    content: str
    category: Optional[str] = None
    author: Optional[str] = None

@app.post("/api/analyze")
async def analyze_article(payload: ArticlePayload):
    task_id = str(uuid.uuid4())
    
    # Envoi de la tâche async
    analyze_article_task.delay(
        task_id=task_id,
        article_id=payload.article_id,
        title=payload.title,
        content=payload.content,
        category=payload.category,
        author=payload.author
    )
    
    return {
        "message": "Analysis started",
        "task_id": task_id,
        "article_id": payload.article_id
    }

@app.get("/health")
def health_check():
    return {"status": "ok"}
