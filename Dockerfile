# 使用官方 Node.js 镜像
FROM node:20.5.0

# 如果需要特定版本的 npm，可以在这里安装
RUN npm install -g npm@10.5.2

# 設定工作目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json 文件
COPY package*.json ./

# 安裝依賴
RUN npm install

# 複製所有源代碼到工作目錄
COPY . .

# 暴露容器運行時的端口
EXPOSE 3000

# 配置環境變量（如有必要）
# ENV NODE_ENV=production

# 執行應用
CMD [ "node", "server.js" ]
