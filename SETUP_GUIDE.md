# 🚀 Complete End-to-End Setup Guide
## Pavi Designer Studio & Training Center

This document provides a complete, step-by-step walkthrough to set up, configure, and run the **Pavi Designer Studio & Training Center** web application on your local machine (Windows / Mac / Linux).

---

## 📋 Table of Contents
1. [Required Software & Download Links](#1-required-software--download-links)
2. [Software Installation Steps](#2-software-installation-steps)
3. [Database Setup with XAMPP (MySQL)](#3-database-setup-with-xampp-mysql)
4. [Project Setup & Environment Configuration](#4-project-setup--environment-configuration)
5. [Required Libraries & Dependencies Overview](#5-required-libraries--dependencies-overview)
6. [Step-by-Step Terminal Commands](#6-step-by-step-terminal-commands)
7. [Running the Application](#7-running-the-application)
8. [Admin Panel Access & Credentials](#8-admin-panel-access--credentials)
9. [Production Build & Deployment Commands](#9-production-build--deployment-commands)
10. [Troubleshooting & Common Issues](#10-troubleshooting--common-issues)

---

## 1. Required Software & Download Links

Download and install the following tools before setting up the project:

| Tool | Purpose | Recommended Version | Official Download Link |
| :--- | :--- | :--- | :--- |
| **Node.js** | JavaScript Runtime & `npm` package manager | **v20.x or v22.x LTS** | [https://nodejs.org/](https://nodejs.org/) |
| **Git** | Version Control & Terminal | **Latest** | [https://git-scm.com/downloads](https://git-scm.com/downloads) |
| **XAMPP** | Local MySQL Database & phpMyAdmin | **v8.2.x or latest** (Apache + MySQL) | [https://www.apachefriends.org/](https://www.apachefriends.org/) |
| **VS Code** *(Optional but Recommended)* | Code Editor | **Latest** | [https://code.visualstudio.com/](https://code.visualstudio.com/) |
| **pnpm** *(Optional)* | Fast disk space-efficient package manager | **Latest** | `npm install -g pnpm` or [https://pnpm.io/installation](https://pnpm.io/installation) |

---

## 2. Software Installation Steps

### A. Install Node.js
1. Visit [https://nodejs.org/](https://nodejs.org/) and download the **LTS (Long Term Support)** installer.
2. Run the `.msi` (Windows) installer.
3. Accept the license agreement, keep default paths, and ensure **"Add to PATH"** is checked.
4. Complete the installation and restart your terminal / PowerShell.
5. Verify in terminal:
   ```bash
   node -v
   npm -v
   ```
   *(Expected: `node v20.x` or `v22.x` and `npm v10.x` or higher)*

### B. Install Git
1. Visit [https://git-scm.com/downloads](https://git-scm.com/downloads) and download the 64-bit Windows installer.
2. Keep the recommended default settings (use Git from command prompt, default branch name, etc.).
3. Verify in terminal:
   ```bash
   git --version
   ```

### C. Install XAMPP
1. Visit [https://www.apachefriends.org/](https://www.apachefriends.org/) and download **XAMPP for Windows**.
2. Run the installer (If prompted by Windows UAC, click "OK").
3. In component selection, ensure **MySQL** and **phpMyAdmin** are selected (Apache is selected by default).
4. Install to the default directory (typically `C:\xampp`).

---

## 3. Database Setup with XAMPP (MySQL)

The application supports **both**:
- **Automatic In-Memory Store** (runs automatically without any database if MySQL is not running)
- **Persistent MySQL Database** (recommended for production and data persistence)

### Step 1: Start MySQL in XAMPP
1. Open the **XAMPP Control Panel** (Search for "XAMPP Control Panel" in Windows Start Menu).
2. Click the **Start** button next to **Apache**.
3. Click the **Start** button next to **MySQL**.
4. Ensure the port shows `3306` and the status shows green.

### Step 2: Create the Database in phpMyAdmin
1. Open your web browser and navigate to:
   ```text
   http://localhost/phpmyadmin/
   ```
2. Click on the **"Databases"** tab in the top navigation bar.
3. In the **"Create database"** input field, enter:
   ```text
   pavi_studio
   ```
4. Leave collation as `utf8mb4_general_ci` or `utf8mb4_unicode_ci`.
5. Click **"Create"**.

> **Note on Tables:** You **do NOT need to manually run SQL scripts to create tables**. The Node.js server automatically creates all required tables (`enquiries`, `services`, `gallery_items`, `materials`, `courses`, `site_settings`) and seeds default studio content on the first startup!

---

## 4. Project Setup & Environment Configuration

### Step 1: Open the Project Directory
Open your terminal (PowerShell or Git Bash) and navigate to the project directory:
```bash
cd d:\kumaran\pavi-designer-studio-main\pavi-designer-studio
```
*(Or right-click the project folder and click "Open in Terminal" / "Open with Code")*

### Step 2: Configure the Environment Variables (`.env`)
The project comes with a `.env.example` file. You need to create a `.env` file in the project root directory.

#### Windows PowerShell Command:
```powershell
Copy-Item .env.example .env
```
*(Or simply duplicate `.env.example` and rename it to `.env`)*

#### Open `.env` and verify the settings:
```env
# Server configuration
PORT=3000
NODE_ENV=development

# Session secret (security key for cookie encryption)
SESSION_SECRET=pavi-designer-studio-secret-key-32chars

# Admin login credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# Database configuration:
# Default XAMPP MySQL configuration has user 'root' with NO password:
DATABASE_URL=mysql://root:@localhost:3306/pavi_studio

# (If your XAMPP MySQL has a password, use:)
# DATABASE_URL=mysql://root:yourpassword@localhost:3306/pavi_studio
```

---

## 5. Required Libraries & Dependencies Overview

All libraries are pre-configured in `package.json`. When you run `npm install`, the following packages will be downloaded:

### Backend Libraries
- **`express`** (`^4.21.2`): Core web framework for REST API routing and static asset serving.
- **`mysql2`** (`^3.15.0`): High-performance MySQL client supporting promises and connection pooling.
- **`multer`** (`^1.4.5-lts.1`): Middleware for handling multipart/form-data image uploads.
- **`dotenv`** (`^16.4.7`): Loads environment variables from `.env` into `process.env`.
- **`cookie`** (`^1.0.2`): Parses and serializes HTTP cookies for authentication sessions.

### Frontend Libraries
- **`react`** & **`react-dom`** (`^19.2.1`): Modern React user interface library.
- **`react-router-dom`** (`^7.1.0`): Client-side single-page application routing.
- **`lucide-react`** (`^0.453.0`): Beautiful, clean icons for UI components.
- **`antd`** & **`@ant-design/icons`**: UI components for administration workflows.
- **`sonner`** (`^2.0.7`): Toast notifications for feedback on form submissions and actions.
- **`tailwindcss`** (`^4.1.14`) & **`@tailwindcss/vite`**: Utility-first styling framework.
- **`vite`** (`^7.1.7`) & **`@vitejs/plugin-react`**: Fast bundler and development server.

---

## 6. Step-by-Step Terminal Commands

Run these commands in order in your terminal:

```bash
# 1. Verify Node.js and Git
node -v
git --version

# 2. Navigate to project root
cd d:\kumaran\pavi-designer-studio-main\pavi-designer-studio

# 3. Create .env from template (if not already done)
cp .env.example .env

# 4. Install all dependencies
npm install
# (Or if using pnpm: pnpm install)
```

---

## 7. Running the Application

### Start Development Server
```bash
npm run dev
```
*(Or `pnpm dev` or `node server/index.js`)*

### What Happens When You Run This Command:
1. The server starts Express and loads your `.env` configuration.
2. Checks connection to MySQL database `pavi_studio`.
3. Auto-creates tables if they do not exist and seeds initial data (services, gallery items, course details, materials, studio contact info).
4. Launches the Vite development server in middleware mode.
5. Listens on **`http://localhost:3000/`**.

### Open in Browser:
- **Main Website**: [http://localhost:3000/](http://localhost:3000/)
- **Services Page**: [http://localhost:3000/services](http://localhost:3000/services)
- **Gallery Page**: [http://localhost:3000/gallery](http://localhost:3000/gallery)
- **Materials Page**: [http://localhost:3000/materials](http://localhost:3000/materials)
- **Classes Page**: [http://localhost:3000/classes](http://localhost:3000/classes)
- **Contact Page**: [http://localhost:3000/contact](http://localhost:3000/contact)

---

## 8. Admin Panel Access & Credentials

The application includes a comprehensive studio management dashboard:

- **Admin Login URL**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Default Username**: `admin`
- **Default Password**: `admin123`

### What You Can Do in the Admin Panel:
- 📊 **Dashboard**: View live metrics on enquiries, gallery counts, services, and catalogue items.
- 📬 **Enquiries Manager**: Review customer leads from the contact form, filter by status (`new`, `contacted`, `completed`), and manage records.
- 🖼️ **Gallery Manager**: Upload local high-resolution pictures to `/uploads/` with categories and captions, or delete items.
- ✂️ **Services Manager**: Add, edit, or toggle active status of tailoring and embroidery services.
- 🧵 **Materials Catalogue**: Manage Aari materials, needle supplies, descriptions, and WhatsApp inquiry buttons.
- 🎓 **Classes & Training**: Update course curriculum, duration, certification details, and FAQs.
- ⚙️ **Studio Settings**: Update phone numbers, WhatsApp link, Instagram URL, Google Maps address, and operating hours.

---

## 9. Production Build & Deployment Commands

If you want to build and test the production-optimized bundle:

### 1. Build Client Assets
```bash
npm run build
```
This generates the optimized production bundle inside `dist/public`.

### 2. Start in Production Mode
```bash
# In Windows PowerShell:
$env:NODE_ENV="production"; npm start

# In Git Bash / Linux / macOS:
NODE_ENV=production npm start
```

---

## 10. Troubleshooting & Common Issues

### ❌ Issue: `MySQL connection unavailable, falling back to in-memory store`
- **Cause**: XAMPP MySQL is either not started or the credentials in `.env` do not match.
- **Solution**:
  1. Open XAMPP Control Panel and check that **MySQL** has the green "Running" status.
  2. Ensure the database `pavi_studio` was created in `http://localhost/phpmyadmin/`.
  3. In `.env`, ensure `DATABASE_URL=mysql://root:@localhost:3306/pavi_studio` (note: no password between `root:` and `@`).
  4. Note that the website **still works seamlessly** even with in-memory fallback.

### ❌ Issue: `Port 3000 is already in use`
- **Cause**: Another process or previous node instance is running on port 3000.
- **Solution**:
  1. The server code has an **automatic port scanner** that will automatically pick `3001`, `3002`, etc., if 3000 is occupied.
  2. Look at the terminal output for the active URL (e.g. `http://localhost:3001/`).
  3. To kill existing Node processes on Windows:
     ```powershell
     Stop-Process -Name node -Force
     ```

### ❌ Issue: Images uploaded in admin do not show up
- **Cause**: The `uploads/` folder does not exist or lacks write permissions.
- **Solution**:
  - The server automatically creates the `uploads` directory at the project root.
  - Uploaded files are served at `/uploads/<filename>`.

### ❌ Issue: `pnpm` command not found
- **Cause**: `pnpm` is not installed globally on your system.
- **Solution**: You can use standard `npm` commands instead (`npm install`, `npm run dev`), or install pnpm globally:
  ```bash
  npm install -g pnpm
  ```

---

## 🏁 Summary Checklist
- [x] Installed **Node.js (LTS)** and **Git**
- [x] Installed **XAMPP** and started **Apache** & **MySQL**
- [x] Created `pavi_studio` database in `phpMyAdmin`
- [x] Created `.env` from `.env.example`
- [x] Executed `npm install`
- [x] Executed `npm run dev`
- [x] Opened `http://localhost:3000/` and `http://localhost:3000/admin/login`
