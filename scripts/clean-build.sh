#!/bin/bash

# 清理Next.js构建目录脚本

echo "===== 开始清理Next.js构建 ====="

# 清理.next目录
echo "清理.next目录..."
rm -rf .next

# 清理node_modules/.cache目录
echo "清理node_modules缓存..."
rm -rf node_modules/.cache

# 如果需要，可以清理全部依赖，然后重新安装
# echo "重新安装依赖..."
# rm -rf node_modules
# npm install
# 或如果使用pnpm
# pnpm install

echo "清理完成！"
echo "请运行 'pnpm dev' 或 'pnpm build' 重新构建项目"

echo "===== 清理完成 =====" 