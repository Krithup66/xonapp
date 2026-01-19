# Xon App - Trading Journal

แอปบันทึกการเทรดสำหรับ iOS และ Android

---

## โครงสร้างโปรเจกต์

```
xonapp/
├── mobile-app/          # แอปมือถือ (Expo/React Native)
│   ├── app/             # หน้าจอต่างๆ (Expo Router)
│   ├── assets/          # รูปภาพ, fonts
│   ├── contexts/        # React contexts (theme)
│   ├── utils/           # ฟังก์ชันช่วยเหลือ
│   ├── app.json         # ตั้งค่า Expo
│   └── package.json
│
├── services/            # Backend (Microservices)
│   ├── api-gateway/     # จุดเข้าถึง API (Port 3000)
│   ├── auth-service/    # ระบบ login/register (Port 3003)
│   ├── user-service/    # จัดการผู้ใช้ (Port 3002)
│   ├── trading-journal-service/  # บันทึกการเทรด (Port 3001)
│   ├── icon-service/    # จัดการไอคอน (Port 3004)
│   └── finance-service/ # จัดการการเงิน (Port 3005)
│
├── supabase/            # Database schema
│   ├── schema.sql       # ตาราง trading_records, users
│   └── icons-schema.sql # ตาราง icons
│
├── scripts/
│   └── security-check.sh
│
├── docker-compose.yml   # รัน services ด้วย Docker
└── README.md            # ไฟล์นี้
```

---

## เริ่มต้นใช้งาน

### 1. Mobile App (iOS/Android)

```bash
# เข้าไปยัง folder
cd mobile-app

# ติดตั้ง dependencies
npm install

# รันแอป
npm start

# หรือรันบน simulator
npm run ios      # iOS Simulator
npm run android  # Android Emulator
```

**หมายเหตุ:** ใช้ Expo Go app สแกน QR code เพื่อทดสอบบนมือถือจริง

### 2. Backend Services

**วิธีที่ 1: Docker (แนะนำ)**
```bash
# สร้าง .env file (ดูตัวอย่างด้านล่าง)
docker-compose up -d
```

**วิธีที่ 2: รันแยก**
```bash
# ติดตั้ง dependencies แต่ละ service
cd services/api-gateway && npm install
cd services/auth-service && npm install
cd services/user-service && npm install
cd services/trading-journal-service && npm install
cd services/icon-service && npm install

# รัน (แต่ละ terminal)
cd services/api-gateway && npm run dev
cd services/auth-service && npm run dev
# ... เหมือนกันสำหรับ services อื่นๆ
```

---

## ตั้งค่า Environment Variables

สร้างไฟล์ `.env` ที่ root folder:

```env
# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
SUPABASE_ANON_KEY=your-anon-key

# JWT
JWT_SECRET=your-jwt-secret-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:19006
```

**สำคัญ:** ห้าม commit ไฟล์ `.env` ขึ้น git

---

## ตั้งค่า Supabase Database

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. สร้างโปรเจกต์ใหม่
3. ไปที่ SQL Editor
4. รัน SQL จากไฟล์:
   - `supabase/schema.sql` (trading records, users)
   - `supabase/finance-schema.sql` (balances, assets, transactions)

### ตาราง Database

**trading_records** - บันทึกการเทรด
| คอลัมน์ | ชนิด | คำอธิบาย |
|---------|------|----------|
| id | UUID | Primary key |
| user_id | TEXT | ID ผู้ใช้ |
| trade_type | TEXT | 'forex' หรือ 'crypto' |
| before_trading | JSONB | ข้อมูลก่อนเทรด |
| after_trading | JSONB | ข้อมูลหลังเทรด |
| created_at | TIMESTAMP | วันที่สร้าง |
| updated_at | TIMESTAMP | วันที่แก้ไข |

**users** - ผู้ใช้งาน
| คอลัมน์ | ชนิด | คำอธิบาย |
|---------|------|----------|
| id | UUID | Primary key |
| email | TEXT | อีเมล (unique) |
| password_hash | TEXT | รหัสผ่าน (hashed) |
| name | TEXT | ชื่อ |
| created_at | TIMESTAMP | วันที่สร้าง |

---

## API Endpoints

### Gateway: `http://localhost:3000`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | /health | ตรวจสอบสถานะ |

### Auth: `/api/auth`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| POST | /register | สมัครสมาชิก |
| POST | /login | เข้าสู่ระบบ |
| POST | /verify | ตรวจสอบ token |

### Trading Journal: `/api/trading-journal`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | /records | ดูรายการทั้งหมด |
| GET | /records/:id | ดูรายการเดียว |
| POST | /records | สร้างรายการใหม่ |
| PUT | /records/:id | แก้ไขรายการ |
| DELETE | /records/:id | ลบรายการ |
| GET | /statistics/summary | สรุปสถิติ |

### Finance: `/api/finance`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | /balance | ดูยอดเงิน |
| PUT | /balance | อัพเดทยอดเงิน |
| GET | /assets | ดู assets ทั้งหมด |
| POST | /assets | เพิ่ม asset |
| GET | /assets/:id | ดู asset เดียว |
| PUT | /assets/:id | แก้ไข asset |
| DELETE | /assets/:id | ลบ asset |
| GET | /transactions | ดูรายการธุรกรรม |
| POST | /transactions | สร้างธุรกรรม |
| GET | /summary | สรุปการเงิน |

### User: `/api/user`

| Method | Endpoint | คำอธิบาย |
|--------|----------|----------|
| GET | /users/:id | ดูโปรไฟล์ |
| PUT | /users/:id | แก้ไขโปรไฟล์ |

---

## สถาปัตยกรรม Microservices

```
┌─────────────────┐
│   Mobile App    │
│  (iOS/Android)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  API Gateway    │  Port 3000
│  (Entry Point)  │
└────────┬────────┘
         │
    ┌────┴────┬──────────┬────────────┐
    │         │          │            │
    ▼         ▼          ▼            ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐
│ Auth   │ │ User   │ │Trading │ │ Icon   │ │Finance │
│Service │ │Service │ │Journal │ │Service │ │Service │
│:3003   │ │:3002   │ │:3001   │ │:3004   │ │:3005   │
└────────┘ └────────┘ └────────┘ └────────┘ └────────┘
    │         │          │            │
    └─────────┴──────────┴────────────┘
                    │
                    ▼
            ┌───────────────┐
            │   Supabase    │
            │  (PostgreSQL) │
            └───────────────┘
```

---

## ความปลอดภัย (Security)

### Authentication
- JWT tokens (หมดอายุ 7 วัน)
- รหัสผ่าน hash ด้วย bcrypt
- ต้องมี 8 ตัวอักษรขึ้นไป, ตัวใหญ่, ตัวเล็ก, ตัวเลข

### Rate Limiting
- Auth: 5 requests / 15 นาที
- API ทั่วไป: 100 requests / 15 นาที
- Write: 20 requests / 15 นาที

### Security Headers
- Helmet.js (CSP, XSS Protection, HSTS)
- CORS configuration
- Input validation ด้วย Zod

### Database
- Row Level Security (RLS)
- ผู้ใช้เข้าถึงได้เฉพาะข้อมูลของตัวเอง

---

## เทคโนโลยี

| ส่วน | เทคโนโลยี |
|------|-----------|
| Mobile | Expo, React Native, TypeScript |
| Backend | Node.js, Express, TypeScript |
| Database | Supabase (PostgreSQL) |
| Container | Docker, Docker Compose |
| Security | JWT, bcrypt, Helmet, Zod |

---

## คำสั่งที่ใช้บ่อย

```bash
# ตรวจสอบ health ของ services
curl http://localhost:3000/health
curl http://localhost:3001/health
curl http://localhost:3002/health
curl http://localhost:3003/health

# ดู logs
docker-compose logs -f

# รีสตาร์ท services
docker-compose restart

# หยุด services
docker-compose down
```

---

## การเพิ่ม Service ใหม่

1. สร้าง folder ใน `services/`
2. สร้าง `package.json`, `tsconfig.json`, `Dockerfile`
3. เพิ่ม service ใน `docker-compose.yml`
4. อัพเดท routing ใน `api-gateway`

---

## สิ่งที่ต้องทำต่อ (Roadmap)

- [ ] หน้า Login/Register
- [ ] หน้าบันทึกการเทรด
- [ ] หน้าสถิติและกราฟ
- [ ] Push Notifications
- [ ] Dark/Light Theme
