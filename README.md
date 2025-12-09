# Restaurant Inventory Management System

A full-stack restaurant inventory management application built with Node.js, Express, React, and TailwindCSS.

## Features
- **Role-Based Access Control**: Admin and Staff roles.
- **Inventory Management**: Track categories, products, and stock levels.
- **Stock Movements**: Track IN/OUT stock history.
- **Dashboard**: Visual overview of inventory.

## Prerequisites
- Node.js installed

## Quick Start

### 1. Backend Setup
```bash
cd backend
npm install
npm start
```
The server will start on http://localhost:5000 and seed default data:
- **Admin**: `admin` / `admin123`
- **Staff**: `staff` / `staff123`

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be available at http://localhost:5173.

## Usage Guide
1. **Login**: Use the credentials above.
2. **Dashboard**: View all categories.
3. **Products**: Click a category to view products.
    - **Staff**: Can view and "Add Stock".
    - **Admin**: Can create, edit, delete categories/products and adjust stock (IN/OUT).
