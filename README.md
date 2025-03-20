# Todo List API

## 📝 Tổng quan
API backend cho ứng dụng Todo List được xây dựng với TypeScript và Node.js.

### 🌟 Tính năng chính
- CRUD operations cho tasks với validation đầy đủ
- Quản lý dependencies giữa các tasks
- Phát hiện và ngăn chặn circular dependencies
- Tối ưu hiệu năng với caching
- Hỗ trợ Docker

## 🛠️ Công nghệ sử dụng

- **Backend Framework:** Node.js, Express.js, TypeScript
- **Database:** MySQL 8.0
- **ORM:** TypeORM
- **Caching:** Node-Cache

## 🚀 Cài đặt và Chạy

### Yêu cầu hệ thống
- Node.js >= 14
- MySQL >= 8.0
- Docker 

### Cài đặt với Docker

1. **Chuẩn bị môi trường:**
```bash

cp .env.example .env


```

2. **Build và chạy với Docker Compose:**
```bash

docker-compose build


docker-compose up -d

docker-compose logs -f
```

3. **Kiểm tra các services:**
```bash

docker-compose ps


```

4. **Quản lý containers:**
```bash

docker-compose stop


docker-compose restart

docker-compose down


docker-compose down -v
```

### Cấu trúc Docker

- Data MySQL được lưu trong Docker volume `mysql_data`
- Các biến môi trường được lấy từ file `.env`
- API có thể truy cập qua `http://localhost:3000`
- MySQL có thể truy cập qua `localhost:3306`