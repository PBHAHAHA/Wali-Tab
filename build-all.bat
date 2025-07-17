@echo off
echo 正在构建所有浏览器版本...
echo.

echo [1/3] 清理旧的构建文件...
if exist dist rmdir /s /q dist
if exist dist-firefox rmdir /s /q dist-firefox
echo 清理完成!
echo.

echo [2/3] 构建 Chrome 版本...
call npm run build:chrome
if %errorlevel% neq 0 (
    echo Chrome 构建失败!
    pause
    exit /b 1
)
echo Chrome 版本构建完成! 输出目录: dist/
echo.

echo [3/3] 构建 Firefox 版本...
call npm run build:firefox
if %errorlevel% neq 0 (
    echo Firefox 构建失败!
    pause
    exit /b 1
)
echo Firefox 版本构建完成! 输出目录: dist-firefox/
echo.

echo ========================================
echo 构建完成!
echo.
echo Chrome 版本: dist/
echo Firefox 版本: dist-firefox/
echo.
echo 安装说明:
echo Chrome: 在 chrome://extensions/ 中加载 dist/ 文件夹
echo Firefox: 在 about:debugging 中加载 dist-firefox/ 文件夹
echo ========================================
pause 