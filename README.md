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
git clone https://github.com/eliahuNexphy/register-app.git
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

