Write-Host "🚀 Привязка PM2 к аккаунту PM2.io через npx..."

npx pm2 link wu7g1s0hatnibt0 pbevla34prskdwc

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Успешно привязано к PM2.io"
} else {
    Write-Host "❌ Ошибка при привязке к PM2.io (код $LASTEXITCODE)"
}
