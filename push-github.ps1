# رفع المشروع إلى GitHub
Set-Location $PSScriptRoot

Write-Host "================================" -ForegroundColor Cyan
Write-Host " رفع مشروع Dirgham CNC إلى GitHub" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

git status -sb
Write-Host ""
Write-Host "جاري الرفع..." -ForegroundColor Yellow

git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "تم الرفع بنجاح!" -ForegroundColor Green
    Write-Host "https://github.com/arms21q-svg/Dargham_CNC43" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "فشل الرفع - تحتاج تسجيل دخول GitHub:" -ForegroundColor Red
    Write-Host "1. أنشئ Token من: GitHub > Settings > Developer settings > Personal access tokens"
    Write-Host "2. أعد تشغيل هذا الملف واستخدم Token ككلمة المرور"
    Write-Host ""
    Write-Host "أو أضف مفتاح SSH من الملف: C:\Users\H\.ssh\id_ed25519.pub"
    Write-Host "إلى: GitHub > Settings > SSH and GPG keys"
}

Write-Host ""
Read-Host "اضغط Enter للإغلاق"
