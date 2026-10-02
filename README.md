# Pavi Designer Studio & Training Center (Pure JavaScript)

Production-oriented full-stack web application for **Pavi Designer Studio & Training Center**, an Aari embroidery studio, bridal blouse designer, customized works studio, training center, and Aari materials catalogue in Padi, Chennai.

Re-engineered completely in **Standard JavaScript (ES Modules, JSX, Node.js + Express.js)** without TypeScript.

---

## Tech Stack

- **Frontend**: React 19, React Router v7, Lucide React, Sonner, Tailwind CSS v4, custom luxury design system (`Cormorant Garamond` & `DM Sans`).
- **Backend**: Node.js, Express.js (v4.21.2) REST API.
- **Database**: MySQL integration via `mysql2/promise` with automatic table creation and automatic in-memory fallback.
- **Authentication**: Secure standalone session-based authentication with HTTP-only cookies and Bearer tokens for the Admin Panel.
- **Media Uploads**: Local image uploads managed via `multer` stored in `/uploads/`.
- **Bundler & Dev Server**: Vite v7 integrated directly with Express.

---

## How to Run

> 📖 **Complete Setup Guide with Download Links & XAMPP Walkthrough**: See [SETUP_GUIDE.md](file:///d:/kumaran/pavi-designer-studio-main/pavi-designer-studio/SETUP_GUIDE.md) for full instructions, software links, and database creation.

### 1. Install Dependencies
```bash
pnpm install
```
*(or `npm install`)*

### 2. Start the Application
```bash
pnpm dev
```
*(or `npm run dev` or `node server/index.js`)*

The server will automatically start on `http://localhost:3000/`.

---

## Admin Panel Access

The Admin Panel is fully built and protected:

- **Login URL**: `http://localhost:3000/admin/login`
- **Default Username**: `admin`
- **Default Password**: `admin123`
*(Configurable via `.env` with `ADMIN_USERNAME` and `ADMIN_PASSWORD`)*

### Admin Capabilities:
- **Overview Dashboard**: Live counters for total enquiries, new enquiries, gallery count, services, and materials.
- **Enquiries Manager**: View incoming customer leads, filter by status (`new`, `contacted`, `completed`), change status, and delete inquiries.
- **Gallery Manager**: Upload local images (JPG, PNG, WebP, AVIF, SVG) with alt text, category, and caption; delete gallery items.
- **Services Manager**: Add new services, edit descriptions, toggle active/inactive status, and delete services.
- **Materials Catalogue**: Add new materials, update descriptions and WhatsApp inquiry labels, toggle active state, and delete records.
- **Course Management**: Edit course description, duration, certificate info, and CTA button text.
- **Business Settings**: Edit phone numbers, WhatsApp number, Instagram profile URL, Google Maps link, address lines, and tagline.

---

## Database Configuration

The application includes an **Automatic Fallback System**:
1. **Zero-Configuration Mode**: If no `DATABASE_URL` is configured or if MySQL is offline, the app runs smoothly with the built-in in-memory data store.
2. **MySQL Mode**: If you provide a MySQL connection string in `.env`:
   ```env
   DATABASE_URL=mysql://root:password@localhost:3306/pavi_studio
   ```
   The backend automatically connects, creates all necessary tables (`enquiries`, `services`, `gallery_items`, `materials`, `courses`, `site_settings`), and seeds the studio data on first startup.

---

## Production Build

To build the client bundle for production:
```bash
pnpm run build
```
And start in production mode:
```bash
pnpm start
```
