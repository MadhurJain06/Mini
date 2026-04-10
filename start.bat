@echo off
echo Starting ImmuniShield...

start "Backend" cmd /k "cd /d D:\D Backup\Study Material (hehe)\Semester VI\Mini\backend && uvicorn main:app --reload"

timeout /t 3

start "ngrok" cmd /k "ngrok http 8000"

timeout /t 3

start "Frontend" cmd /k "cd /d D:\D Backup\Study Material (hehe)\Semester VI\Mini\immunishield && npm run dev"

echo All services started!
echo.
echo 1. Copy the ngrok URL from the ngrok window
echo 2. Update BACKEND_URL in Colab Cell 2
echo 3. Run Colab cells 2 and 5 only (cells 3 and 4 stay loaded)
pause