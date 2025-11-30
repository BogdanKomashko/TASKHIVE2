@echo off
echo ====================================
echo   Запуск Frontend сервера
echo ====================================
cd frontend
if not exist node_modules (
    echo Встановлення залежностей...
    call npm install
)
echo Запуск сервера...
npm run dev
pause

