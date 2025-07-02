@echo off
cd /d "C:\Users\1\Desktop\mon-bot-discord"

git add --all

set datetime=%date% %time%
git commit -m "Mise à jour automatique %datetime%"

git push origin main

pause
