# PharmaSys – Pharmaceutical Inventory Management

A full-stack migration of a legacy Classic ASP / VBScript pharmaceutical drug inventory system
to a modern microservices architecture using **React JS**, **Spring Boot 3**, and **MySQL 8**.

---

## Architecture Overview

```
pharma-app/
├── frontend/     # React JS (Vite) – runs on http://localhost:5173
├── backend/      # Spring Boot 3 REST API – runs on http://localhost:8080
└── db/           # MySQL schema + seed SQL files
```

---

## Prerequisites

Make sure the following are installed on your machine:

| Tool        | Version   | Download                                      |
|-------------|-----------|-----------------------------------------------|
| Java        | 17+       | https://adoptium.net/                         |
| Maven       | 3.8+      | https://maven.apache.org/download.cgi         |
| Node.js     | 18+       | https://nodejs.org/                           |
| MySQL       | 8.x       | https://dev.mysql.com/downloads/mysql/        |

Verify installations:
```bash
java -version
mvn -version
node -version
npm -version
mysql --version
```

---

## Step 1 – Database Setup

Open a MySQL client (MySQL Workbench, DBeaver, or CLI):

```bash
mysql -u root -p
```

Then run the two SQL files in order:

```sql
SOURCE /path/to/pharma-app/db/01_schema.sql;
SOURCE /path/to/pharma-app/db/02_seed.sql;
```

Or via CLI directly:

```bash
mysql -u root -p < pharma-app/db/01_schema.sql
mysql -u root -p < pharma-app/db/02_seed.sql
```

This creates:
- Database `pharmadb`
- Tables: `tbl_users`, `tbl_drugs`, `tbl_stock_movements`
- Two users: `admin` (Admin role) and `viewer` (Viewer role)
- 7 sample drugs covering all alert states

### Default DB credentials

The backend is pre-configured to connect with:
- **Host:** `localhost:3306`
- **Database:** `pharmadb`
- **Username:** `root`
- **Password:** `root`

To change these, edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.username=your_username
spring.datasource.password=your_password
```

---

## Step 2 – Backend (Spring Boot)

```bash
cd pharma-app/backend
mvn spring-boot:run
```

Maven will download dependencies on first run (~1-2 minutes).

The API starts at: **http://localhost:8080**

To verify:
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

You should receive a JSON response with a JWT token.

---

## Step 3 – Frontend (React)

```bash
cd pharma-app/frontend
npm install
npm run dev
```

The app starts at: **http://localhost:5173**

---

## Step 4 – Access the Application

Open your browser and navigate to: **http://localhost:5173**

### Default Login Credentials

| Username | Password   | Role   | Permissions                         |
|----------|------------|--------|-------------------------------------|
| admin    | admin123   | Admin  | Full access (read + write + delete) |
| viewer   | viewer123  | Viewer | Read-only access                    |

---

## Features

### Dashboard
- Summary cards: Total Drugs, Expired, Critical (≤7 days), Warning (≤30 days), Low Stock

### Drug Master
- Paginated drug list (20 per page) with colour-coded rows:
  - 🔴 **Red** – Expired
  - 🟠 **Orange** – Expires within 7 days (Critical)
  - 🟡 **Yellow** – Expires within 30 days (Warning)
  - 🩷 **Pink** – Low stock (qty ≤ reorder level)
- Add / Edit / Delete drugs (Admin only)
- Search by name, category, expiry date range

### Stock Management
- **Stock In** – Increment quantity, log movement (Admin only)
- **Stock Out** – Decrement quantity with insufficient-stock validation (Admin only)
- **Stock History** – Full movement log, filterable by drug

### Reports
- **Expiry Report** – Drugs expiring within N days
- **Low Stock Report** – Drugs at or below reorder level

---

## REST API Endpoints

| Method | Endpoint                  | Description                          | Auth         |
|--------|---------------------------|--------------------------------------|--------------|
| POST   | /api/auth/login           | Login, returns JWT                   | Public       |
| GET    | /api/dashboard            | Summary counts                       | Authenticated|
| GET    | /api/drugs                | Paginated drug list                  | Authenticated|
| POST   | /api/drugs                | Create drug                          | Admin only   |
| GET    | /api/drugs/{id}           | Get drug by ID                       | Authenticated|
| PUT    | /api/drugs/{id}           | Update drug                          | Admin only   |
| DELETE | /api/drugs/{id}           | Delete drug                          | Admin only   |
| GET    | /api/drugs/search         | Search drugs                         | Authenticated|
| POST   | /api/stock/in             | Record stock in                      | Admin only   |
| POST   | /api/stock/out            | Record stock out                     | Admin only   |
| GET    | /api/stock/history        | Stock movement history               | Authenticated|
| GET    | /api/reports/expiry       | Expiry report (?days=N)              | Authenticated|
| GET    | /api/reports/low-stock    | Low stock report                     | Authenticated|

---

## Project Structure

```
pharma-app/
├── README.md
├── db/
│   ├── 01_schema.sql                  # CREATE DATABASE + tables
│   └── 02_seed.sql                    # Sample users and 7 drugs
│
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/pharma/
│       │   ├── PharmaApplication.java
│       │   ├── config/
│       │   │   ├── SecurityConfig.java
│       │   │   └── CorsConfig.java
│       │   ├── controller/
│       │   │   ├── AuthController.java
│       │   │   ├── DrugController.java
│       │   │   ├── StockController.java
│       │   │   └── ReportController.java
│       │   ├── service/
│       │   │   ├── AuthService.java
│       │   │   ├── DrugService.java
│       │   │   ├── StockService.java
│       │   │   └── ReportService.java
│       │   ├── repository/
│       │   │   ├── UserRepository.java
│       │   │   ├── DrugRepository.java
│       │   │   └── StockMovementRepository.java
│       │   ├── model/
│       │   │   ├── User.java
│       │   │   ├── Drug.java
│       │   │   └── StockMovement.java
│       │   ├── dto/
│       │   │   ├── LoginRequest.java
│       │   │   ├── LoginResponse.java
│       │   │   ├── DrugDTO.java
│       │   │   ├── StockMovementDTO.java
│       │   │   └── DashboardDTO.java
│       │   └── security/
│       │       ├── JwtUtil.java
│       │       └── JwtFilter.java
│       └── resources/
│           └── application.properties
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── index.css
        ├── api/
        │   └── axios.js
        ├── context/
        │   └── AuthContext.jsx
        ├── components/
        │   ├── Navbar.jsx
        │   ├── ProtectedRoute.jsx
        │   └── DrugStatusBadge.jsx
        └── pages/
            ├── Login.jsx
            ├── Dashboard.jsx
            ├── DrugList.jsx
            ├── DrugForm.jsx
            ├── DrugSearch.jsx
            ├── StockIn.jsx
            ├── StockOut.jsx
            ├── StockHistory.jsx
            ├── ExpiryReport.jsx
            └── LowStockReport.jsx
```

---

## Troubleshooting

**Backend won't start – `validate` schema error**
> Run `01_schema.sql` first. `spring.jpa.hibernate.ddl-auto=validate` requires the tables to already exist.

**CORS errors in browser**
> Ensure the backend is running on port 8080 and frontend on 5173. Check `CorsConfig.java`.

**401 Unauthorized on all API calls**
> JWT token may have expired (default 24h). Log out and log in again.

**`Access denied` for Viewer role**
> Viewer accounts cannot create, update, delete drugs or record stock movements. Log in as `admin` for write operations.

**MySQL connection refused**
> Ensure MySQL service is running: `sudo service mysql start` (Linux) or start from MySQL Workbench.

**Port already in use**
> Change `server.port` in `application.properties` for backend, or `server.port` in `vite.config.js` for frontend.
