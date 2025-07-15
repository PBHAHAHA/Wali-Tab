@echo off
echo 正在修复构建问题...

REM 运行标准构建
call npm run build

REM 复制并修复options.html
if exist "options.html" (
    copy "options.html" "dist\options.html"
    echo 已复制 options.html 到 dist 目录
    
    REM 使用PowerShell替换文件内容
    powershell -Command "(Get-Content 'dist\options.html') -replace '/src/options/main.ts', 'options.js' | Set-Content 'dist\options.html'"
    echo 已修复 options.html 中的脚本路径
)

REM 检查必要文件
echo.
echo 检查构建结果:
if exist "dist\popup.html" echo ✓ popup.html
if exist "dist\options.html" echo ✓ options.html
if exist "dist\content.js" echo ✓ content.js
if exist "dist\background.js" echo ✓ background.js
if exist "dist\manifest.json" echo ✓ manifest.json

echo.
echo 构建完成！现在可以在浏览器中加载 dist 目录了。
pause 