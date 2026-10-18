# VYRA — Universal Second-Hand Marketplace

**Value Finds a New Life.**

🔗 **Live Demo:** https://vyra-marketplace.onrender.com/

## About the Project

VYRA is a full-stack peer-to-peer marketplace that allows users to buy and sell pre-loved products at affordable prices. It supports multiple categories, including electronics, furniture, fashion, books, home appliances, sports equipment, and everyday essentials.

The platform promotes sustainable consumption by giving used products a second life through a simple and user-friendly interface.

## Technologies Used

- **Frontend:** React.js, Vite, React Router, CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Authentication:** JWT, bcryptjs
- **Tools:** Git, GitHub, Render

## Key Features

- User registration, login, and logout.
- Secure password hashing and JWT-based authentication.
- Browse and search products by title, brand, and description.
- Filter products by category and condition.
- Sort listings by price and newest arrivals.
- View product details, seller information, and location.
- Create, edit, and delete product listings.
- Protected routes and seller ownership verification.
- Responsive UI with a luxury burgundy, blush pink, and ivory theme.

## Implementation Details

### 1. Frontend

The React frontend is organized into reusable components, pages, and services.

- **Components:** Navbar, ProductCard, SearchBar, CategoryFilter, ContactModal, and ProtectedRoute.
- **Pages:** Home, Browse, Product Details, Login, Register, Sell Item, My Listings, and Edit Item.
- **Authentication State:** React Context manages the user's authentication state.
- **API Integration:** A centralized API service communicates with the backend REST API.

### 2. Backend

The Express.js backend provides REST API endpoints for authentication and product management.

- **Authentication Routes:** Register users, log in, and retrieve the authenticated profile.
- **Product Routes:** Create, retrieve, update, and delete listings.
- **Middleware:** JWT verification, authorization, and centralized error handling.
- **Validation:** Checks required fields, valid categories, and positive product prices.

### 3. Database

MongoDB stores user accounts and product listings using Mongoose schemas.

- **User Model:** Stores user details and securely hashed passwords.
- **Product Model:** Stores product information, price, category, condition, location, and seller reference.

### 4. Security

- Passwords are hashed using bcryptjs.
- JWT tokens protect authenticated API requests.
- Backend ownership checks ensure sellers can edit or delete only their own listings.
- Environment variables keep sensitive configuration outside the source code.

## REST API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Authenticate a user |
| GET | `/api/auth/me` | Get the current user |
| GET | `/api/products` | Browse and filter products |
| GET | `/api/products/:id` | Get product details |
| GET | `/api/products/my-listings` | Get the user's listings |
| POST | `/api/products` | Create a listing |
| PUT | `/api/products/:id` | Update a listing |
| DELETE | `/api/products/:id` | Delete a listing |
| GET | `/api/health` | Check server health |

## Run Locally

**Prerequisites:** Node.js, npm, and a MongoDB connection.

### 1. Clone the repository

```bash
git clone https://github.com/MUTAKANI-DINNI-SRAVYA/FSD-2.git
cd FSD-2
```

### 2. Install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 3. Configure environment variables

Create a `server/.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

### 4. Start the application

Run the backend in one terminal:

```bash
cd server
npm run dev
```

Run the frontend in another terminal:

```bash
cd client
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Future Enhancements

- Real-time buyer-seller chat.
- Multiple product image uploads.
- Location-based product discovery.
- Integrated online payments.
- Email verification and notifications.

## Deployment

VYRA is deployed on Render.

**Live Application:** https://vyra-marketplace.onrender.com/

---

**VYRA — Making second-hand shopping simple, affordable, and sustainable.**
