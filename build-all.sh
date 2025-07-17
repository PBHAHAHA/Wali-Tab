#!/bin/bash

echo "正在构建所有浏览器版本..."
echo

echo "[1/3] 清理旧的构建文件..."
rm -rf dist
rm -rf dist-firefox
echo "清理完成!"
echo

echo "[2/3] 构建 Chrome 版本..."
npm run build:chrome
if [ $? -ne 0 ]; then
    echo "Chrome 构建失败!"
    exit 1
fi
echo "Chrome 版本构建完成! 输出目录: dist/"
echo

echo "[3/3] 构建 Firefox 版本..."
npm run build:firefox
if [ $? -ne 0 ]; then
    echo "Firefox 构建失败!"
    exit 1
fi
echo "Firefox 版本构建完成! 输出目录: dist-firefox/"
echo

echo "========================================"
echo "构建完成!"
echo
echo "Chrome 版本: dist/"
echo "Firefox 版本: dist-firefox/"
echo
echo "安装说明:"
echo "Chrome: 在 chrome://extensions/ 中加载 dist/ 文件夹"
echo "Firefox: 在 about:debugging 中加载 dist-firefox/ 文件夹"
echo "========================================" 