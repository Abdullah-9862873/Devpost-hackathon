# VoiceBite - Voice-Activated Restaurant Management System

VoiceBite is a full-stack MERN application designed for a modern, hands-free restaurant experience. It features a voice-activated interface for customers to browse the menu and manage their cart, alongside a robust administrative dashboard for menu management.

--- 

## 🚀 Features

- **Voice Commands**: Integrated voice recognition to navigate categories, search products, and add items to the cart.
- **Dynamic Menu**: Real-time data fetching from a MongoDB backend via an Express MVC API.
- **Admin Dashboard**:
  - **Add Product**: Create new menu items with categories, prices, and descriptions.
  - **Manage Items**: Centralized list to view and delete existing products.
- **Responsive Design**: Premium, dark-themed UI with glass-morphism aesthetics.
- **Cart Management**: Real-time cart updates with interactive feedback using `react-hot-toast`.

---

## 🛠️ Technologies Used

### Frontend
- **React.js**: Functional components and Hooks.
- **React Router**: For seamless SPA navigation.
- **Axios**: For API communication.
- **Lucide-React**: For a modern, consistent icon set.
- **React-Hot-Toast**: For premium, non-intrusive notifications.
- **Vanilla CSS**: Custom design system with modern glass-morphism.

### Backend
- **Node.js & Express**: MVC (Model-View-Controller) architecture.
- **MongoDB & Mongoose**: Flexible NoSQL database and schema modeling.
- **Dotenv**: Secure environment variable management.
- **Nodemon**: Development mode auto-restart.

---

## 📂 File Structure

```text
hackathon/
├── backend/
│   ├── config/            # Database connection setup
│   ├── controllers/       # API logic handlers
│   ├── models/            # Mongoose schemas (MenuItem)
│   ├── routes/            # Express route definitions
│   ├── seed.js            # Initial database population script
│   └── server.js          # Entry point
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── Admin/     # AddProduct & ManageProducts
│   │   │   ├── Menu/      # ProductCard & MenuViews
│   │   │   ├── Navigation/# Sidebar & Routing
│   │   │   └── Cart/      # StickyCart & CartPage
│   │   ├── lib/           # Context API (CartContext)
│   │   └── hooks/         # Custom Hooks (SpeechRecognition)
│   └── App.jsx            # Main App Orchestrator
└── .env                   # Sensitive Environment variables (Ignored)
```

---

## 🏁 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) installed.
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB Atlas URI.

### 2. Setup Environment
Create a `.env` file in the root directory (refer to `.env.example`):
```bash
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/voicebite
```

### 3. Install Dependencies
**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 4. Seed the Database
Populate your MongoDB with the initial menu items:
```bash
cd backend
node seed.js
```

### 5. Run the Application
Start both servers simultaneously:

**Run Backend:**
```bash
cd backend
npm start
```

**Run Frontend:**
```bash
cd frontend
npm run dev
```

The app will be available at `http://localhost:3000`.

---

## 📝 Admin Instructions
To access management features, use the **Administration** section at the bottom of the sidebar:
1. **Add Product**: Fill the form to add a new dish.
2. **Manage Items**: Remove items from the database; changes reflect immediately on the home page.

--- 
