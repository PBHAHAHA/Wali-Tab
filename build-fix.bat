@echo off
echo 正在构建Vue插件...

:: 运行Vite构建
call npm run build

:: 检查构建是否成功
if %errorlevel% neq 0 (
    echo 构建失败！
    pause
    exit /b 1
)

echo 构建完成！

:: 检查关键文件是否存在
if not exist "dist\newtab.html" (
    echo 错误：newtab.html 未找到
    pause
    exit /b 1
)

if not exist "dist\manifest.json" (
    echo 错误：manifest.json 未找到
    pause
    exit /b 1
)

echo 所有文件检查通过！
echo 插件已准备就绪，可以加载到浏览器中。
echo 构建输出目录：dist/
pause 