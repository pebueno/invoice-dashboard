# 🧾 Invoice Dashboard

Welcome to the **Invoice Dashboard**! This project is built using **Fastify** for the backend, **Prisma** for database management, and **PostgreSQL** as the database. The backend is responsible for managing invoice data and serves API routes for handling invoices.

## 🚀 Getting Started

### Prerequisites

Make sure you have the following tools installed on your machine:

- [Node.js](https://nodejs.org/en/) (v14 or above)
- [PostgreSQL](https://www.postgresql.org/download/)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Prisma](https://www.prisma.io/) (installed through npm)

### 📂 Project Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd invoice-dashboard
    ```

2. **Install dependencies**:
   ```bash
   npm install
    ```


3. **Create the PostgreSQL database**:  Ensure you have PostgreSQL running locally or within your environment. Create a database named `invoiceDB`.

4. **Set up environment variables**:  Create a `.env` file in the root directory and add the following:
    ```bash
   DATABASE_URL="postgresql://<your_user>:<your_password>@localhost:5432/invoiceDB?schema=public" 
    ```
    Replace <your_user> and <your_password> with your PostgreSQL username and password.


5. **Run Prisma migrations**: After setting up the environment variables, apply the database schema by running:
    ```bash
    npx prisma migrate dev --name init
    ```

6. **Generate Prisma Client**: Ensure the Prisma Client is generated and synced with the schema:
    ```bash
    npx prisma generate
    ```

### 🏃 Running the Project

To run the Fastify server locally:
```bash
npx ts-node src/server.ts
