# House Core

House Core is a comprehensive home management system designed to streamline household organization. It provides tools for managing multiple houses, tracking inventory (warehouse), generating automated shopping lists, managing cooking recipes, and setting up events with recurring timers.

## 🚀 Tech Stack

### Backend
- **Framework:** [NestJS](https://nestjs.com/) (Node.js)
- **Language:** TypeScript
- **Database:** PostgreSQL with [TypeORM](https://typeorm.io/)
- **Authentication:** JWT (JSON Web Tokens) & Cookie-based sessions
- **Documentation:** Swagger UI
- **Validation:** Class-validator & Class-transformer

### Frontend
- **Framework:** [Next.js](https://nextjs.org/) (React 19)
- **Styling:** Bootstrap 5 & Bootstrap Icons
- **HTTP Client:** Axios
- **Notifications:** React-toastify
- **State Management:** React Hooks (Context/State)

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Database:** PostgreSQL

---

## ✨ Key Functionalities

### 🏠 Houses
- Create and manage multiple household entities.
- Invite and manage users within each house.
- Assign roles (Admin, Member) to control access and permissions.

### 📦 WareHouse (Inventory Management)
- **Categories & Subcategories:** Organize products in a hierarchical structure.
- **Product Tracking:** Detailed product information (name, unit, description).
- **Batch Management:** Track expiration dates, quantity, and specific batches of products.
- **Low Stock Alerts:** Monitor inventory levels in real-time.

### 🛒 Shop List (Autogen)
- Automated shopping list generation based on warehouse inventory.
- Real-time updates as products are consumed or added.
- Link between recipes and missing ingredients.

### 🍳 Cook Recipes
- Create and store recipes with detailed instructions.
- Associate products from the warehouse with recipes.
- Calculate ingredient availability based on current inventory.

### 📅 Events with Reset Timers
- Manage recurring household tasks or events.
- Configurable reset timers for tasks like cleaning, maintenance, or shopping.
- Visual tracking of event status and time remaining.

---

## 📂 Project Structure

```text
house-core/
├── backend/            # NestJS API
│   ├── src/
│   │   ├── auth/       # Authentication & Authorization
│   │   ├── house/      # House management logic
│   │   ├── product/    # Warehouse & Inventory logic
│   │   ├── cook-recipe/# Recipe management
│   │   ├── event/      # Recurring events logic
│   │   └── database/   # Entities & Migrations
├── frontend/           # Next.js Application
│   ├── src/
│   │   ├── app/        # Next.js App Router pages
│   │   ├── views/      # React components and views
│   │   └── http/       # API connectors (Axios)
├── db/                 # Database volume/data
├── docs/               # Documentation & Diagrams
└── compose.yaml        # Docker orchestration
```

---

## 🛠️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) & [Docker Compose](https://docs.docker.com/compose/)
- npm or yarn

### 1. Database Setup
The easiest way to start the database is using Docker:
```bash
docker compose up -d
```
This will start a PostgreSQL instance on `localhost:5432`.

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`) and configure your variables:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run start:dev
   ```
The API will be available at `http://localhost:3000`. You can access the Swagger documentation at `http://localhost:3000/api`.

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
The application will be available at `http://localhost:3001`.

---

## 📖 API Documentation

Once the backend is running, you can explore and test the API endpoints using Swagger:
- **URL:** `http://localhost:3000/api`

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
