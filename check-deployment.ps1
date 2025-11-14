# Скрипт проверки развертывания на Vercel
Write-Host "=== Проверка развертывания marshrutka.fun ===" -ForegroundColor Cyan
Write-Host ""

# 1. Проверка DNS
Write-Host "1. Проверка DNS..." -ForegroundColor Yellow
$dnsResult = nslookup marshrutka.fun 2>&1
if ($dnsResult -match "Address") {
    Write-Host "   [OK] DNS работает" -ForegroundColor Green
    $dnsResult | Select-String "Address" | ForEach-Object { Write-Host "   $_" }
} else {
    Write-Host "   [ERROR] Проблема с DNS" -ForegroundColor Red
}
Write-Host ""

# 2. Проверка HTTP (без SSL)
Write-Host "2. Проверка HTTP (без SSL)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://marshrutka.fun" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   [OK] HTTP работает! Status: $($response.StatusCode)" -ForegroundColor Green
    $contentPreview = if ($response.Content.Length -gt 100) { $response.Content.Substring(0, 100) + "..." } else { $response.Content }
    Write-Host "   Response: $contentPreview" -ForegroundColor Gray
} catch {
    Write-Host "   [WARNING] HTTP не работает: $($_.Exception.Message)" -ForegroundColor Yellow
}
Write-Host ""

# 3. Проверка HTTPS
Write-Host "3. Проверка HTTPS..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://marshrutka.fun" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   [OK] HTTPS работает! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "   Response: $($response.Content)" -ForegroundColor Gray
} catch {
    Write-Host "   [ERROR] HTTPS не работает: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Возможные причины:" -ForegroundColor Yellow
    Write-Host "      - SSL сертификат еще не выдан (подождите 5-10 минут)" -ForegroundColor Gray
    Write-Host "      - Домен не полностью настроен в Vercel" -ForegroundColor Gray
    Write-Host "      - DNS еще не распространился" -ForegroundColor Gray
}
Write-Host ""

# 4. Проверка API endpoint
Write-Host "4. Проверка API endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "https://marshrutka.fun/api/v1/routes" -UseBasicParsing -TimeoutSec 10 -ErrorAction Stop
    Write-Host "   [OK] API работает! Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    $statusCode = if ($_.Exception.Response) { $_.Exception.Response.StatusCode.value__ } else { "Unknown" }
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "   [INFO] API требует авторизацию (Status: $statusCode) - это нормально" -ForegroundColor Yellow
    } elseif ($statusCode -eq 404) {
        Write-Host "   [ERROR] API endpoint не найден (404)" -ForegroundColor Red
    } else {
        Write-Host "   [WARNING] API ответил со статусом: $statusCode" -ForegroundColor Yellow
    }
}
Write-Host ""

# 5. Итоговые рекомендации
Write-Host "=== Рекомендации ===" -ForegroundColor Cyan
Write-Host "1. Проверьте Vercel Dashboard:" -ForegroundColor White
Write-Host "   https://vercel.com/sergeis-projects-78aa3a6d" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Проверьте статус домена:" -ForegroundColor White
Write-Host "   Settings -> Domains -> marshrutka.fun" -ForegroundColor Gray
Write-Host "   Должен быть статус: Valid" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Проверьте последний deployment:" -ForegroundColor White
Write-Host "   Deployments -> Latest -> должен быть Ready" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Проверьте логи:" -ForegroundColor White
Write-Host "   Deployments -> Latest -> View Function Logs" -ForegroundColor Gray
Write-Host ""

