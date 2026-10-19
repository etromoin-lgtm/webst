Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting OurCompany Local Development Environment" -ForegroundColor Cyan
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Starting Backend Server (Port 5000)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; node index.js"

Write-Host "Starting Frontend Server (Port 5173)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\web-app'; npm run dev"

Write-Host ""
Write-Host "Servers launched in separate terminal windows!" -ForegroundColor Green
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  - Blog:     http://localhost:5173/blog" -ForegroundColor White
Write-Host "  - Admin:    http://localhost:5173/admin" -ForegroundColor White
Write-Host "  - API:      http://localhost:5000/api" -ForegroundColor White
Write-Host "========================================================" -ForegroundColor Cyan
