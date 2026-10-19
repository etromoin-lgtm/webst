@echo off
echo ========================================================
echo  Starting OurCompany Local Development Environment
echo ========================================================
echo.

echo Starting Backend Server (Port 5000)...
start "Backend (Port 5000)" cmd /k "cd /d %~dp0backend && node index.js"

echo Starting Frontend Vite Dev Server (Port 5173)...
start "Frontend (Port 5173)" cmd /k "cd /d %~dp0web-app && npm run dev"

echo.
echo ========================================================
echo  Local servers launched in separate windows!
echo  - Frontend: http://localhost:5173
echo  - Blog:     http://localhost:5173/blog
echo  - Admin:    http://localhost:5173/admin
echo  - API:      http://localhost:5000/api
echo ========================================================
