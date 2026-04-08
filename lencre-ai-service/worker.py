import os
import time
import requests
from celery import Celery
from dotenv import load_dotenv
import json
from openai import OpenAI

load_dotenv()

celery_app = Celery(
    "ai_worker",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost:6379/0"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "redis://localhost:6379/0")
)

LARAVEL_API_URL = os.getenv("LARAVEL_API_URL", "http://localhost:8000")
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

@celery_app.task(bind=True)
def analyze_article_task(self, task_id, article_id, title, content, category, author):
    start_time = time.time()
    
    system_prompt = """
Expert Fact-Checker. Analyse l'article pour détecter erreurs, biais ou fake news.
Structure JSON stricte :
{
  "score": <0-100>,
  "level": "FIABLE" | "CORRECTIONS" | "BLOQUE",
  "recommendation": "<2 phrases max>",
  "corrections_for_journalist": [{"issue": "...", "severity": "low|medium|high", "detail": "...", "paragraph": <int|null>}]
}
Règles : <40=BLOQUE, 40-69=CORRECTIONS, >=70=FIABLE. Impitoyable.
"""

    user_prompt = f"Cat: {category}\nAuth: {author}\nTitle: {title}\nContent:\n{content}"
    
    try:
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            response_format={ "type": "json_object" },
            max_tokens=800,
            temperature=0.3
        )
        
        result_text = response.choices[0].message.content
        ai_data = json.loads(result_text)
        
        score = ai_data.get("score", 0)
        level = ai_data.get("level", "BLOQUE")
        recommendation = ai_data.get("recommendation", "Analyse IA terminée.")
        corrections = ai_data.get("corrections_for_journalist", [])
        
    except Exception as e:
        print(f"Erreur lors de l'appel OpenAI : {e}")
        score = 0
        level = "BLOQUE"
        recommendation = f"Erreur de traitement IA interne : {str(e)}"
        corrections = []
    
    report_payload = {
        "article_id": article_id,
        "task_id": task_id,
        "score": score,
        "level": level,
        "recommendation": recommendation,
        "processing_time_ms": int((time.time() - start_time) * 1000),
        "summary_for_editor": "Analyse OpenAI terminée avec succès.",
        "corrections_for_journalist": corrections
    }
    
    callback_url = f"{LARAVEL_API_URL}/api/v1/internal/ai-report"
    
    try:
        response = requests.post(callback_url, json=report_payload)
        response.raise_for_status()
        print(f"Task {task_id}: Successfully sent report to Laravel.")
    except Exception as e:
        print(f"Task {task_id}: Error calling Laravel webhook: {e}")
        
    return {"status": "completed", "article_id": article_id}
