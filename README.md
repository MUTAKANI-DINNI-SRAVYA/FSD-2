# 🌿 VYRA — Universal Second-Hand Marketplace (MERN Stack)

> **“Value Finds a New Life.”** — A luxury, modern, and sustainable full-stack peer-to-peer web marketplace built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). 

Designed for **people of all ages, professions, and backgrounds** to buy, sell, and discover quality pre-loved goods—including electronics, furniture, fashion, home appliances, books, tools, sports gear, and everyday essentials.

Styled with the **Luxury Burgundy, Blush Pink, and Jet-Black Design System** (`#7A1B2C` Burgundy Wine, `#F2D7DE` Blush Pink, `#111111` Jet Black, `#FFF9F7` Warm Ivory, and `#DCA6B0` Soft Rose).

---

## 🌟 Key Features

1. **User Authentication & Authorization (JWT & Bcrypt):**
   - User account registration with validation and encrypted password hashing using **bcryptjs**.
   - Secure login generating signed **JSON Web Tokens (JWT)**.
   - Dynamic session state managed via React Context (`AuthContext`).
   - Route protection for listing creation and management (`ProtectedRoute`).
   - **Backend Ownership Verification:** Only the authenticated seller who created a listing can edit or delete it (`403 Forbidden` protection).

2. **Universal Home Page & Hero Section:**
   - Headline: *"Give Pre-Loved Things a New Life."*
   - Supporting narrative: *"Discover great second-hand finds, save money, and give useful items a second chance. Buy and sell everyday essentials, electronics, furniture, fashion, and more."*
   - Embedded search bar directly inside the hero banner.
   - **How It Works** section explaining the 3-step peer-to-peer trade flow.
   - **Browse Categories** section featuring 10 diverse everyday categories.
   - **Recently Listed Products** grid highlighting prices in Burgundy.

3. **Full Product Catalog & Filtering:**
   - Real-time search across titles, brands, and descriptions.
   - 10 universal categories:
     1. *Electronics* (phones, laptops, cameras, TVs, headphones)
     2. *Furniture* (sofas, beds, tables, chairs, cupboards)
     3. *Fashion* (clothing, shoes, bags, accessories)
     4. *Home and Kitchen* (appliances, cookware, home décor)
     5. *Books and Education* (books, calculators, study materials)
     6. *Sports and Fitness* (bicycles, gym gear, sports equipment)
     7. *Vehicles and Accessories* (helmets, riding gear, auto accessories)
     8. *Toys and Baby Products* (strollers, toys, baby care)
     9. *Tools and Equipment* (power tools, DIY sets, gardening)
     10. *Other* (miscellaneous pre-owned goods)
   - Filter by condition: `Like New`, `Good`, `Fair`.
   - Sort by `Price: Low to High`, `Price: High to Low`, or `Newest First`.

4. **Product Details & Safe Contact:**
   - Full product image preview with automated SVG placeholder fallback.
   - Price in Burgundy, condition badges, and city/location.
   - Seller card with direct contact details.
   - **Contact Seller Modal:** Direct copy-to-clipboard contact information and safe buying guidelines (meet in public, inspect items before payment).

5. **Sell an Item (Add Listing):**
   - Clean form card on warm ivory background.
   - Auto-fills seller identity and contact from authenticated profile.
   - Form fields: *What are you selling?*, *Product description*, *Price in ₹*, *Choose a category*, *Select product condition*, *Product image URL*, *City or location*.
   - Strict validation: requires positive price, valid category, and required location.

6. **My Listings (Seller Dashboard):**
   - Clean dashboard showing exclusively the authenticated user's listings.
   - Edit functionality pre-populating fields for `PUT` updates.
   - Delete listing with confirmation prompt.

---

## 🎨 Luxury Burgundy Color Palette

The entire design system is driven by CSS Custom Properties (`client/src/index.css`):

| Color Name | Hex Code | Role in Application |
|---|---|---|
| **Burgundy Wine** | `#7A1B2C` | Primary brand color, navbar, primary CTA buttons, price highlights |
| **Blush Pink** | `#F2D7DE` | Soft backgrounds, active category pills, badges, modal borders |
| **Jet Black** | `#111111` | Primary text headings, high-contrast details, footer background |
| **Warm Ivory** | `#FFF9F7` | Soft main page canvas background |
| **Pure White** | `#FFFFFF` | Product cards, form containers, modal surfaces, button text |
| **Soft Rose** | `#DCA6B0` | Secondary accents, condition tag borders, subtle hover highlights |

---

## 📂 Project Structure

```
FSD2/
├── package.json                 # Root convenience scripts (client & server)
├── README.md                    # Project documentation & viva guide
├── .gitignore                   # Excludes node_modules, build, and .env
├── client/                      # React Frontend (Vite)
│   ├── index.html               # Entry HTML with Plus Jakarta Sans Google font
│   ├── package.json             # Frontend dependencies (React, React Router)
│   ├── vite.config.js           # Vite build configuration
│   └── src/
│       ├── main.jsx             # React DOM root entry
│       ├── App.jsx              # Router & layout shell
│       ├── index.css            # Luxury Burgundy CSS Design System & Variables
│       ├── context/
│       │   └── AuthContext.jsx  # React Context for authentication and token storage
│       ├── components/
│       │   ├── Navbar.jsx       # Sticky navbar with auth state, badge & mobile toggle
│       │   ├── ProductCard.jsx  # Reusable card with image, badge & price
│       │   ├── SearchBar.jsx    # Real-time search input with clear button
│       │   ├── CategoryFilter.jsx# Category pills, condition selector & sort dropdown
│       │   ├── ContactModal.jsx # Popup showing seller contact & safe trading tips
│       │   ├── ProtectedRoute.jsx# Auth guard for restricted routes
│       │   └── Footer.jsx       # Jet-black luxury footer
│       ├── pages/
│       │   ├── Home.jsx         # Hero, search bar, how-it-works, categories & recent
│       │   ├── Browse.jsx       # Full catalog with search & multi-filters
│       │   ├── ProductDetails.jsx# Detailed view, contact modal trigger
│       │   ├── Login.jsx        # User login form
│       │   ├── Register.jsx     # User registration form
│       │   ├── SellItem.jsx     # Listing submission form with validation
│       │   ├── MyListings.jsx   # Authenticated seller management dashboard
│       │   └── EditItem.jsx     # Update existing listing form
│       └── services/
│           ├── api.js           # Centralized fetch REST API client with Bearer auth
│           └── mockData.js      # 10 realistic universal sample products
└── server/                      # Node.js + Express Backend
    ├── server.js                # Express app entry, middleware & route mounting
    ├── seed.js                  # Standalone MongoDB database seeder script
    ├── package.json             # Backend dependencies (express, mongoose, bcryptjs, jsonwebtoken, cors, dotenv)
    ├── .env                     # Local environment variables (PORT, MONGODB_URI, JWT_SECRET)
    ├── .env.example             # Configuration template for examiners
    ├── config/
    │   └── db.js                # Mongoose connection logic with offline resilience
    ├── data/
    │   └── sampleProducts.js    # 10 realistic marketplace sample listings
    ├── middleware/
    │   ├── auth.js              # JWT Bearer token authentication middleware
    │   └── errorHandler.js      # Centralized error & validation handler
    ├── models/
    │   ├── User.js              # User Mongoose Schema with bcrypt password hashing
    │   └── Product.js           # Product Mongoose Schema with seller reference
    └── routes/
        ├── authRoutes.js        # Authentication endpoints (/api/auth)
        └── productRoutes.js     # Product CRUD endpoints (/api/products)
```

---

## 🚀 How to Run the Project Locally

### 1. Install Dependencies
```powershell
# From the project root:
cd client
npm install

cd ../server
npm install
```

### 2. Configure Environment Variables
Inside `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/secondhand_marketplace
JWT_SECRET=your_super_secret_jwt_key_here
```

> **Note for Viva/Evaluation:** If local MongoDB is not installed, you can paste your free cloud MongoDB Atlas URI into `server/.env`. If the database is offline, the backend and client smoothly fall back to in-memory sample data so your demonstration will never fail.

### 3. Run the Application
Open two separate terminal windows:

**Terminal 1 (Backend Server):**
```powershell
cd server
npm run dev
# Server running at: http://localhost:5000
# Health check: http://localhost:5000/api/health
```

**Terminal 2 (Frontend Client):**
```powershell
cd client
npm run dev
# React app running at: http://localhost:5173
```

---

## 🌐 Deploy to Render (Live in 2 Minutes)

This repository includes a `render.yaml` blueprint for automatic full-stack deployment on **[Render](https://render.com/)**:

### Quick Steps to Deploy:
1. Go to **[dashboard.render.com](https://dashboard.render.com/)** and sign in with your GitHub account.
2. Click **New +** > **Web Service** (or **Blueprint**).
3. Connect your repository: `https://github.com/MUTAKANI-DINNI-SRAVYA/FSD-2`.
4. Render will auto-detect the configuration from `render.yaml`:
   - **Environment**: `Node`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Health Check Path**: `/api/health`
5. *(Optional)* Add your `MONGODB_URI` environment variable from your free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster under **Environment Variables**. (If left blank, the app runs smoothly using its resilient offline fallback with sample listings).
6. Click **Deploy Web Service**.
7. Once deployed, Render gives you a public HTTPS URL (e.g., `https://vyra-marketplace.onrender.com`) where your full-stack React frontend and Express REST API will be live for everyone!

---

## 📡 REST API Endpoints

### Authentication Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register a new user (`name`, `email`, `password`, `phone`, `city`) |
| `POST` | `/api/auth/login` | Public | Authenticate user credentials and return signed JWT token |
| `GET` | `/api/auth/me` | Protected | Retrieve authenticated user profile |

### Product Endpoints
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/products` | Public | Retrieve catalog (supports `search`, `category`, `condition`, `sort`) |
| `GET` | `/api/products/my-listings` | Protected | Retrieve listings owned by the logged-in user |
| `GET` | `/api/products/:id` | Public | Retrieve single product by ID |
| `POST` | `/api/products` | Protected | Create a new listing owned by the logged-in user |
| `PUT` | `/api/products/:id` | Protected | Update listing (enforces seller ownership) |
| `DELETE` | `/api/products/:id` | Protected | Delete listing (enforces seller ownership) |
| `GET` | `/api/health` | Public | Server and database status check |

---

## 🔒 Security & Authorization Highlights

1. **Password Hashing:** Passwords are never stored in plain text; they are hashed with `bcryptjs` using a 10-round salt before persistence.
2. **Stateless JWT Authorization:** Protected API endpoints verify the `Authorization: Bearer <token>` header on every request.
3. **Backend Ownership Enforcement:** When updating or deleting an item, the server confirms that `product.seller.toString() === req.user._id.toString()`. Requests from unauthorized users are rejected with `403 Forbidden`.
4. **Credential Protection:** Secrets (`MONGODB_URI`, `JWT_SECRET`) are stored in `.env`, which is strictly ignored by `.gitignore`.

---

## 🎯 Viva Examination Guide (25 Questions & Answers)

1. **What is the objective of this project?**  
   *Answer:* To build a universal peer-to-peer web marketplace where people of all ages and backgrounds can buy and sell pre-loved goods—such as electronics, furniture, fashion, and tools—at accessible prices while promoting a sustainable, circular economy.
2. **What is the MERN stack?**  
   *Answer:* MongoDB (NoSQL Database), Express.js (Backend Framework), React.js (Frontend UI Library), and Node.js (JavaScript Runtime).
3. **What architecture does this application follow?**  
   *Answer:* A 3-Tier Client-Server Architecture consisting of a Presentation Tier (React SPA), an Application Logic Tier (Express REST API with JWT Auth), and a Data Persistence Tier (MongoDB).
4. **How is user authentication implemented?**  
   *Answer:* Users register with their credentials; passwords are encrypted with `bcryptjs`. Upon login, the server signs a JSON Web Token (JWT) containing the user's ID. The client stores this token and sends it in the `Authorization: Bearer <token>` header for protected actions.
5. **How is authorization/ownership enforced when deleting a listing?**  
   *Answer:* The `protect` middleware decodes the token and attaches `req.user`. Before deleting, the route verifies that `product.seller.toString() === req.user._id.toString()`. If a user attempts to delete someone else's listing, the server returns `403 Forbidden`.
6. **What is the difference between Authentication and Authorization?**  
   *Answer:* Authentication verifies **who you are** (logging in with valid email/password). Authorization verifies **what you are allowed to do** (e.g., you can view any listing, but you can only edit/delete your own listings).
7. **Why did you use React.js over traditional multi-page HTML?**  
   *Answer:* React offers a component-based structure, Virtual DOM for fast re-rendering, dynamic client-side routing without page reloads, and declarative state management with hooks.
8. **What are React Hooks? Which hooks did you use?**  
   *Answer:* Functions that enable functional components to use state and lifecycle features. We used `useState` (component state), `useEffect` (data fetching), `useContext` (global auth state), and `useNavigate`/`useParams`/`useLocation` (React Router).
9. **What is a REST API?**  
   *Answer:* Representational State Transfer is an architectural style utilizing stateless HTTP requests (`GET`, `POST`, `PUT`, `DELETE`) with structured JSON data transfer.
10. **Where is CRUD implemented in this project?**  
    *Answer:*  
    - **Create:** `POST /api/products` (Sell an item)  
    - **Read:** `GET /api/products` and `GET /api/products/:id` (Browse & Details)  
    - **Update:** `PUT /api/products/:id` (Edit item)  
    - **Delete:** `DELETE /api/products/:id` (Delete item from My Listings)
11. **What is Mongoose and why is it used?**  
    *Answer:* Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It enforces structured schemas, validates field types, handles relationships (`ref: 'User'`), and provides clean asynchronous query methods.
12. **What is the difference between SQL and NoSQL?**  
    *Answer:* SQL databases (like MySQL/PostgreSQL) are relational, table-based, and enforce rigid schemas. NoSQL databases (like MongoDB) are document-oriented, storing flexible JSON/BSON documents that adapt well to evolving marketplace listings.
13. **What is CORS and why is it needed?**  
    *Answer:* Cross-Origin Resource Sharing is a browser security measure preventing scripts on one origin (`http://localhost:5173`) from accessing resources on another origin (`http://localhost:5000`). We configure the `cors()` middleware in Express to allow safe communication.
14. **How does search and filtering work on the backend?**  
    *Answer:* Express extracts query parameters (`?search=...&category=...`). A MongoDB query object uses `$regex` with the `'i'` flag for case-insensitive keyword matching and filters by category/condition fields.
15. **What are CSS Custom Properties (Variables) and how are they used?**  
    *Answer:* Variables declared in `:root` (e.g. `--color-burgundy: #7A1B2C;`) define color tokens globally. Changing one variable updates the entire application's theme instantly.
16. **Why do we validate data on both frontend and backend?**  
    *Answer:* Client-side validation gives immediate feedback to users and saves network bandwidth. Server-side validation is mandatory for security, as malicious clients can bypass the frontend using API tools like Postman.
17. **What are the primary HTTP status codes used?**  
    *Answer:* `200 OK` (successful read/update/delete), `201 Created` (new account or product listed), `400 Bad Request` (validation error), `401 Unauthorized` (missing/invalid token), `403 Forbidden` (not the owner), `404 Not Found` (item not found), and `500 Internal Server Error`.
18. **What is the purpose of `dotenv` and `.env`?**  
    *Answer:* It keeps sensitive configuration values (database credentials, JWT secret keys, port numbers) out of source control, preventing security leaks when publishing code to GitHub.
19. **How does the project handle missing or broken image links?**  
    *Answer:* Product cards implement an `onError` event handler that swaps broken URLs for an embedded SVG fallback placeholder.
20. **What are the 10 product categories supported?**  
    *Answer:* Electronics, Furniture, Fashion, Home & Kitchen, Books & Education, Sports & Fitness, Vehicles & Accessories, Toys & Baby Products, Tools & Equipment, and Other.
21. **What is `async/await` and why is it preferred over callbacks?**  
    *Answer:* It provides readable, synchronous-looking syntax for handling asynchronous operations, avoiding "callback hell" and making error handling clean with `try/catch`.
22. **What is Vite and why was it chosen over Create React App?**  
    *Answer:* Vite uses native ES modules and Rollup/esbuild, providing near-instant development server startup and lightning-fast Hot Module Replacement (HMR).
23. **What is `express.json()` middleware?**  
    *Answer:* Built-in Express middleware that parses incoming requests with JSON payloads and populates `req.body`.
24. **What are the limitations of this mini project?**  
    *Answer:* Images are stored as URLs rather than direct AWS S3/Cloudinary multipart uploads; transactions occur through direct peer contact rather than an integrated escrow payment gateway; email verification is omitted for simplicity.
25. **What future enhancements would you propose?**  
    *Answer:* Real-time buyer-seller chat via WebSockets (Socket.io), location radius filtering using Google Maps API, multi-image upload with Cloudinary, and an integrated escrow payment gateway.

---

## 📋 GitHub Submission Pre-Push Checklist

Before pushing to your GitHub repository:
- [x] `.env` files are ignored by `.gitignore` (only `.env.example` is committed).
- [x] `node_modules/` and `client/dist/` are ignored.
- [x] All demo identity banners and student-specific notices have been removed.
- [x] Authentication (Register, Login, Logout) is working.
- [x] Protected routes and listing ownership checks are enforced on the backend.
- [x] Sample listings use fictional contact details.
- [x] `npm run build` succeeds with zero errors.

### Commands to Push to GitHub:
```powershell
# 1. Initialize git repository (if not already done)
git init

# 2. Stage all project files
git add .

# 3. Commit changes
git commit -m "feat: VYRA Universal Second-Hand Marketplace with JWT Authentication and Luxury Burgundy Branding"

# 4. Link to your remote GitHub repository
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git

# 5. Push to GitHub
git push -u origin main
```
