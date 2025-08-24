Write-Host "课程成绩查询系统后端启动脚本" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host "`n正在检查Node.js环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "Node.js版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "错误: 未找到Node.js，请先安装Node.js" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "`n正在安装依赖包..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -ne 0) {
    Write-Host "错误: 依赖安装失败" -ForegroundColor Red
    Read-Host "按回车键退出"
    exit 1
}

Write-Host "`n依赖安装完成，正在启动服务器..." -ForegroundColor Green
Write-Host "服务器将在 http://localhost:3000 启动" -ForegroundColor Cyan
Write-Host "按 Ctrl+C 停止服务器" -ForegroundColor Yellow
Write-Host ""

npm start

Read-Host "按回车键退出"
