# 選擇一個基礎映像
FROM node:14

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
