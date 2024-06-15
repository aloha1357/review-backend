
# review-backend


## 描述

本專案是一個基於 Node.js 的 Web 應用，主要實現了用戶認證、評論管理、用戶配置檔案管理等核心功能。它使用 MongoDB 作為後端資料庫，支援 RESTful API 交互，適用於需要用戶交互和數據存儲的 Web 應用。

## 功能

- **用戶認證**：支援用戶註冊、登入、登出功能。使用 JSON Web Tokens (JWT) 進行會話管理。
- **評論管理**：允許用戶對文章或其他媒體內容進行評論，支援添加、查詢、編輯和刪除評論。
- **用戶配置檔案管理**：用戶可以查看和編輯自己的配置檔案，包括基本資訊和密碼等。
- **郵件服務**：支援自動發送電子郵件功能，如註冊確認郵件和密碼重置郵件。
- **密碼管理**：安全地處理和存儲用戶密碼，支援密碼複雜性驗證和加密存儲。
- **用戶喜好管理**：用戶可以標記或取消標記他們喜歡的內容。

## 安裝指南

### 先決條件

確保您的系統已安裝以下軟體：

- Node.js (建議版本 14 或更高)
- MongoDB
- npm (Node 包管理器)

### 安裝步驟

1. **克隆倉庫**

   從 GitHub 克隆倉庫到您的本地機器。

   ```bash
   git clone https://github.com/yourusername/yourrepositoryname.git
   cd yourrepositoryname
   ```

2. **安裝依賴**

   在專案根目錄下運行以下命令安裝所需依賴。

   ```bash
   npm install
   ```

3. **設置環境變數**

   創建一個 `.env` 檔案在專案根目錄下，添加必要的環境變數：

   ```plaintext
   DB_URI=mongodb://localhost:27017/yourdbname
   JWT_SECRET=yourjwtsecret
   EMAIL_SERVICE=your_email_service_provider
   EMAIL_USERNAME=your_email_username
   EMAIL_PASSWORD=your_email_password
   ```

4. **運行應用**

   啟動服務器：

   ```bash
   npm start
   ```

   這將在 `http://localhost:3000` 上啟動您的應用。

5. **訪問應用**

   在瀏覽器中打開 `http://localhost:3000` 來訪問應用，或使用 Postman 測試 API 端點。

## 測試

運行預定義的測試套件以確保一切正常。

```bash
npm test
```

## 貢獻

歡迎

貢獻！請先閱讀 `CONTRIBUTING.md` 文件了解如何為專案作出貢獻。

## 許可證

本專案採用 [MIT license](LICENSE.md) 許可。
