@echo off
setlocal EnableExtensions
title MH Wilds 技能模拟器

rem =====================================================================
rem MH Wilds 技能模拟器 快速启动：首次运行自动安装依赖，
rem 启动 Vite 开发服务器（http://localhost:1420）并自动打开浏览器。
rem 用法：双击运行，或在终端执行 start.bat
rem
rem 编码说明：本文件必须保持 ANSI/GBK 编码（与 MonsterOrderToolsV2 的
rem build-windows.bat 同口径），请勿另存为 UTF-8。
rem =====================================================================

cd /d "%~dp0"

where npm >nul 2>&1
if errorlevel 1 (
  echo [ERROR] 未找到 npm，请先安装 Node.js 并确保其在 PATH 中
  goto :fail
)

if not exist node_modules (
  echo [1/2] 未检测到 node_modules，执行 npm install 安装依赖...
  call npm install
  if errorlevel 1 goto :fail
)

echo [2/2] 启动开发服务器，就绪后浏览器将自动打开 http://localhost:1420 ...
echo 提示：端口 1420 被占用（如已有实例在跑）时会启动失败，先关闭旧实例再试。
call npm run dev -- --open
if errorlevel 1 goto :fail
exit /b 0

:fail
echo.
echo [ERROR] 启动失败，请检查上方日志。
pause
exit /b 1
