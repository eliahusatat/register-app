# Register App

A monorepo project with:

- **Client:** React + TypeScript + Mantine
- **Server:** Node.js + Express + TypeScript
- **Shared:** Common TypeScript types

This app lets users register, login, and view registered users, all stored in memory.

---

## ✨ Tech Stack

- **Monorepo:** npm workspaces
- **Client:**
  - React
  - Mantine (UI components)
  - Axios
- **Server:**
  - Express
  - Zod (validation)
  - UUID (unique IDs)
  - CORS

---

## 🚀 Getting Started

### 🧩 Clone the repository

```bash
git clone https://github.com/eliahusatat/register-app.git
```

### 🧩 Enter to the root folder

```bash
cd register-app
```

### 🧩 From the root folder, run:

```bash
npm install
```
This installs dependencies for all workspaces (client, server, shared).

### 🧩 build the Shared : 
in the Shared folder run:
```bash
npm run build
```

### 🧩 add .env file to the server folder like this : 
```code
PORT=3001
JWT_SECRET=your app auth secret key
MONGO_URI=your mongo uri
```

### 🧩 Start the Server : 

```bash
npm run dev:server
```
Server runs at: 

```bash
http://localhost:3001
```

### 🧩 Start the Client : 

```bash
npm run dev:client
```

Client runs at: 

```bash
http://localhost:5173/
```

