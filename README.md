# eShop 🛒
Welcome to **eShop**, a fully integrated MERN stack e-commerce platform where performance and real-time experience come first. eShop provides a seamless shopping experience, complete with cart management, payment processing, and a snappy UI.

## Version 🏷️
- Backend: `1.0.0`
- Frontend: `1.0.0`

## Description 📝

eShop is designed to be a lightweight, yet powerful e-commerce solution. Built with the latest web technologies for efficiency and ease of use, it supports everything from product browsing to order management.

## Features ✨

- **🛍️ E-commerce Core**: Product catalog, shopping cart, checkout system
- **🔐 User Management**: Secure authentication, user profiles, order history
- **💳 Payment Integration**: PayPal payment processing
- **📱 Responsive Design**: Mobile-first approach with TailwindCSS
- **⚡ Real-time Updates**: Live cart updates and order tracking
- **🖼️ File Management**: Image uploads for products
- **🌍 Internationalization**: Multi-language support (EN, DE, RO)
- **🎨 Admin Dashboard**: Product and order management
- **🔍 Search & Filter**: Advanced product discovery
- **📊 Analytics**: Sales and user analytics

## Technologies 🧰

### Frontend
- **React 18** - Modern React with hooks
- **Redux Toolkit** - State management
- **TailwindCSS** - Utility-first CSS framework
- **Vite** - Fast build tool
- **React Router** - Client-side routing
- **i18next** - Internationalization

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **Multer** - File uploads

### Security & Performance
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **bcryptjs** - Password hashing
- **Morgan** - HTTP request logger

## 🚀 Quick Deploy

### Option 1: Render (Recommended)
```bash
# Run the deployment script
./deploy.sh

# Choose option 1 for Render deployment
```

### Option 2: Docker
```bash
# Build and run with Docker
docker build -t eshop-app .
docker run -d -p 10000:10000 eshop-app

# Or use docker-compose
docker-compose up -d
```

### Option 3: Manual Deployment
See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## Installation 💾

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone https://github.com/Alexandra2888/eShop
cd eShop

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install

# Start the application
cd ..
npm run backend
npm run frontend
```

## Usage 🖥️

### Development Scripts
```bash
# Backend development
npm run backend          # Start backend with nodemon
npm run start           # Start backend in production mode

# Frontend development  
npm run frontend        # Start frontend dev server
npm run build           # Build frontend for production

# Database operations
npm run data:import     # Import sample data
npm run data:destroy    # Clear database
```

### Environment Variables
Create `.env` files in both `backend/` and `frontend/` directories:

**Backend (.env)**
```bash
MONGO_URL=mongodb://localhost:27017/eshop
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=5001
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

**Frontend (.env)**
```bash
VITE_API_URL=http://localhost:5001
```

## 📁 Project Structure

```
eShop/
├── backend/                 # Backend API
│   ├── config/             # Database & configuration
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── uploads/            # File uploads
│   └── utils/              # Utility functions
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── redux/          # State management
│   │   └── utils/          # Frontend utilities
│   └── public/             # Static assets
├── docker-compose.yml      # Docker configuration
├── Dockerfile              # Multi-stage Docker build
├── deploy.sh               # Deployment automation
└── DEPLOYMENT.md           # Deployment guide
```

## 🌐 API Endpoints

### Authentication
- `POST /api/users/register` - User registration
- `POST /api/users/login` - User login
- `GET /api/users/profile` - Get user profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders/myorders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

## 🎯 Portfolio Features

This project demonstrates:
- **Full-stack development** with MERN stack
- **Modern React patterns** (hooks, context, functional components)
- **State management** with Redux Toolkit
- **API design** with RESTful endpoints
- **Database modeling** with MongoDB/Mongoose
- **Authentication & authorization**
- **File uploads** and media management
- **Payment integration** with PayPal
- **Responsive design** with TailwindCSS
- **Internationalization** support
- **Production deployment** configuration

## 🔧 Development

### Code Quality
- ESLint configuration
- Prettier formatting
- SOLID principles
- KISS design patterns

### Testing
- Manual testing for all features
- API endpoint testing
- Cross-browser compatibility

## 📊 Performance

- **Lazy loading** for images
- **Code splitting** with React Router
- **Optimized builds** with Vite
- **Efficient state management** with Redux
- **Database indexing** for fast queries

## 🚨 Troubleshooting

### Common Issues
1. **CORS errors**: Check backend CORS configuration
2. **MongoDB connection**: Verify connection string and network access
3. **Build failures**: Ensure Node.js 18+ and all dependencies installed
4. **File uploads**: Check uploads directory permissions

### Getting Help
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment issues
- Review [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)
- Check console logs for error details

## Contributing 🤝

Contributions are welcome! Please feel free to submit a Pull Request.

## License 📄

This project is licensed under the MIT License.

## Author 👤

**Alexandra2888** - Full-stack developer passionate about creating modern web applications.

## Preview 📸

![Macbook Pro-1717079992553](https://github.com/Alexandra2888/eShop/assets/76844097/4d81359e-ff03-4459-9127-5ef62d262b39)

![Macbook Pro-1717080129745](https://github.com/Alexandra2888/eShop/assets/76844097/8c8c8c8c-8c8c-8c8c-8c8c-8c8c8c8c8c8c)

![Macbook Pro-1717080201428](https://github.com/Alexandra2888/eShop/assets/76844097/f1177909-d295-4fac-9c6c-2c0ee4924ff6)

## 🌟 Live Demo

- **Frontend**: [https://eshop-frontend.onrender.com](https://eshop-frontend.onrender.com)
- **Backend API**: [https://eshop-backend.onrender.com](https://eshop-backend.onrender.com)
- **Health Check**: [https://eshop-backend.onrender.com/api/health](https://eshop-backend.onrender.com/api/health)

---

### ⭐ Star this repository if you find it helpful for your portfolio!
