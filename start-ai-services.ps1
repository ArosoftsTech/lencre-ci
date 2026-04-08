Write-Host "Lancement des services pour le Fact-Checking IA" -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit -Command `"title REDIS_SERVER; cd 'd:\Projets Dev\Lencre-ci\redis_bin'; .\redis-server.exe`""
Start-Process powershell -ArgumentList "-NoExit -Command `"title UVICORN_FASTAPI; cd 'd:\Projets Dev\Lencre-ci\lencre-ai-service'; .\venv\Scripts\Activate.ps1; uvicorn main:app --port 8001 --reload`""
Start-Process powershell -ArgumentList "-NoExit -Command `"title CELERY_WORKER; cd 'd:\Projets Dev\Lencre-ci\lencre-ai-service'; .\venv\Scripts\Activate.ps1; celery -A worker.celery_app worker -l info -P eventlet`""
Start-Process powershell -ArgumentList "-NoExit -Command `"title LARAVEL_QUEUE; cd 'd:\Projets Dev\Lencre-ci\lencre-api'; php artisan queue:work`""
Write-Host "OK!" -ForegroundColor Green
