# Todo List API

## 📝 Tổng quan
API backend cho ứng dụng Todo List với các tính năng nâng cao, được xây dựng với TypeScript và Node.js.

### 🌟 Tính năng chính
- ✨ CRUD operations cho tasks với validation đầy đủ
- 🔄 Quản lý dependencies giữa các tasks
- 🎯 Phát hiện và ngăn chặn circular dependencies
- ⚡ Tối ưu hiệu năng với caching
- 📧 Hệ thống thông báo qua email
- 🐳 Hỗ trợ Docker

## 🛠️ Công nghệ sử dụng

- **Backend Framework:** Node.js, Express.js, TypeScript
- **Database:** MySQL 8.0
- **ORM:** TypeORM
- **Caching:** Node-Cache
- **Email:** Nodemailer
- **Scheduling:** Node-cron
- **Container:** Docker
- **Testing:** Jest
- **Documentation:** Swagger/OpenAPI

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 14
- MySQL >= 8.0
- Docker (tùy chọn)

### Cài đặt thông thường

1. **Clone repository:**
```bash
git clone <repository-url>
cd todo-list-api
```

2. **Cài đặt dependencies:**
```bash
npm install
```

3. **Cấu hình môi trường:**
Tạo file `.env` từ mẫu:
```bash
cp .env.example .env
```

Cập nhật các biến môi trường:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=todo_list

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
NOTIFICATION_EMAIL=recipient@email.com

# Cache
CACHE_TTL=3600
```

4. **Khởi tạo database:**
```bash
# Tạo và cấu hình database
mysql -u your_username -p < init.sql

# Hoặc copy nội dung file init.sql và chạy trực tiếp trong MySQL console
```

5. **Chạy migrations:**
```
```

### Cài đặt với Docker

1. **Chuẩn bị môi trường:**
```bash
# Copy file env mẫu
cp .env.example .env

# Cập nhật các biến môi trường trong file .env
```

2. **Build và chạy với Docker Compose:**
```bash
# Build các images
docker-compose build

# Chạy các containers
docker-compose up -d

# Xem logs
docker-compose logs -f
```

3. **Kiểm tra các services:**
```bash
# Kiểm tra status của các containers
docker-compose ps

# API endpoint: http://localhost:3000
# MySQL port: 3306
```

4. **Quản lý containers:**
```bash
# Dừng các containers
docker-compose stop

# Khởi động lại
docker-compose restart

# Dừng và xóa containers
docker-compose down

# Xóa tất cả data (volumes)
docker-compose down -v
```

### Cấu trúc Docker

1. **API Service (`api`)**
   - Node.js 18 với TypeScript
   - Tự động build và chạy ứng dụng
   - Kết nối với MySQL service
   - Volume cho logs

2. **Database Service (`mysql`)**
   - MySQL 8.0
   - Tự động chạy script khởi tạo (init.sql)
   - Volume cho data persistence
   - Native password authentication

### Lưu ý khi sử dụng Docker

- Data MySQL được lưu trong Docker volume `mysql_data`
- Logs được mount vào thư mục `./logs`
- Các biến môi trường được lấy từ file `.env`
- API có thể truy cập qua `http://localhost:3000`
- MySQL có thể truy cập qua `localhost:3306`