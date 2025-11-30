@echo off
echo ====================================
echo   Запуск Backend сервера
echo ====================================
cd Backend
if not exist node_modules (
    echo Встановлення залежностей...
    call npm install
)
echo Запуск сервера...
npm run dev
pause

