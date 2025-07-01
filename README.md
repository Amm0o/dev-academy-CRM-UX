# CRM Frontend - React Application

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Authentication Flow](#authentication-flow)
- [Routing](#routing)
- [API Integration](#api-integration)
- [Build & Deployment](#build--deployment)
- [Troubleshooting](#troubleshooting)
- [Development Guidelines](#development-guidelines)

## 🎯 Overview

The CRM Frontend is a modern, responsive React application built with TypeScript that provides an intuitive interface for customer relationship management. It features a clean, professional design with role-based access control, real-time updates, and seamless API integration.

### Key Features
- **User Authentication**: Secure login/logout with JWT token management
- **Product Catalog**: Browse, search, and filter products
- **Shopping Cart**: Add items, update quantities, persistent storage
- **Order Management**: Place orders, view order history
- **Admin Dashboard**: User and product management interfaces
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Real-time Updates**: Cart updates, stock availability
- **Role-based UI**: Different interfaces for Admin and Regular users

## 🏗️ Architecture

### High-Level Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    React Application                     │
├─────────────────┬─────────────────┬────────────────────┤
│     Pages       │   Components    │     Services       │
├─────────────────┼─────────────────┼────────────────────┤
│  - HomePage     │  - ProductCard  │  - AuthService     │
│  - AdminPage    │  - CartItem     │  - ProductService  │
│  - ProductPage  │  - UserList     │  - CartService     │
│  - CartPage     │  - OrderHistory │  - OrderService    │
└─────────────────┴─────────────────┴────────────────────┘
          │                │                  │
          └────────────────┴──────────────────┘
                           │
                    ┌──────▼──────┐
                    │   Context    │
                    │  Providers   │
                    ├──────────────┤
                    │ - AuthContext│
                    │ - CartContext│
                    └──────────────┘
```

### Component Hierarchy
```
App
├── AuthContext (Provider)
│   └── CartContext (Provider)
│       ├── Layout
│       │   ├── Header
│       │   │   ├── Navigation
│       │   │   └── UserMenu
│       │   └── Footer
│       └── Routes
│           ├── PublicRoute
│           │   ├── HomePage
│           │   └── LoginPage
│           ├── PrivateRoute
│           │   ├── ProductPage
│           │   ├── CartPage
│           │   └── OrdersPage
│           └── AdminRoute
│               └── AdminPage
│                   ├── ProductManagement
│                   └── UserManagement
```

## 💻 Technology Stack

- **Framework**: React 18.2
- **Language**: TypeScript 5.0
- **Routing**: React Router v6
- **State Management**: React Context API + useReducer
- **HTTP Client**: Axios
- **Styling**: CSS Modules + CSS Variables
- **Form Handling**: React Hook Form
- **Validation**: Yup
- **Build Tool**: Create React App
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode

## 📁 Project Structure

```
crm-frontend/
├── public/
│   ├── index.html          # HTML template
│   ├── favicon.ico         # App icon
│   └── manifest.json       # PWA manifest
├── src/
│   ├── components/         # Reusable components
│   │   ├── Admin/
│   │   │   ├── ProductManagement.tsx
│   │   │   ├── UserManagement.tsx
│   │   │   └── AdminStats.tsx
│   │   ├── Cart/
│   │   │   ├── CartItem.tsx
│   │   │   ├── CartSummary.tsx
│   │   │   └── CartIcon.tsx
│   │   ├── Common/
│   │   │   ├── LoadingSpinner.tsx
│   │   │   ├── ErrorBoundary.tsx
│   │   │   └── Modal.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Sidebar.tsx
│   │   └── Product/
│   │       ├── ProductCard.tsx
│   │       ├── ProductList.tsx
│   │       └── ProductFilter.tsx
│   ├── context/           # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── CartContext.tsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   └── useDebounce.ts
│   ├── pages/             # Page components
│   │   ├── AdminPage.tsx
│   │   ├── CartPage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── OrdersPage.tsx
│   │   ├── ProductPage.tsx
│   │   └── styles/        # Page-specific styles
│   ├── routes/            # Route components
│   │   ├── AdminRoute.tsx
│   │   ├── PrivateRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── services/          # API service layer
│   │   ├── api.ts         # Axios instance
│   │   ├── authService.ts
│   │   ├── cartService.ts
│   │   ├── orderService.ts
│   │   └── productService.ts
│   ├── types/             # TypeScript definitions
│   │   ├── index.ts
│   │   ├── user.types.ts
│   │   ├── product.types.ts
│   │   └── order.types.ts
│   ├── utils/             # Utility functions
│   │   ├── constants.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── App.tsx            # Root component
│   ├── App.css            # Global styles
│   ├── index.tsx          # Entry point
│   └── index.css          # Base styles
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## 📋 Prerequisites

### Required Software
- Node.js 14.x or higher
- npm 6.x or yarn 1.22.x
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Recommended Tools
- Visual Studio Code
- React Developer Tools (browser extension)
- Redux DevTools (for debugging context)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd crm-frontend
```

### 2. Install Dependencies
```bash
# Using npm
npm install

# Using yarn
yarn install
```

### 3. Set Up Environment Variables
```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env
```

## ⚙️ Configuration

### Environment Variables (.env)
```env
# API Configuration
REACT_APP_API_URL=http://localhost:5205/api
REACT_APP_API_TIMEOUT=30000

# Feature Flags
REACT_APP_ENABLE_ADMIN=true
REACT_APP_ENABLE_ORDERS=true

# External Services (if any)
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_key
REACT_APP_GOOGLE_ANALYTICS_ID=your_ga_id

# Development
REACT_APP_ENV=development
REACT_APP_DEBUG=true
```

### API Configuration (src/services/api.ts)
```typescript
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: Number(process.env.REACT_APP_API_TIMEOUT) || 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Handle token expiration
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

## 🏃 Running the Application

### Development Mode
```bash
# Start development server
npm start
# or
yarn start
```

The application will open at `http://localhost:3000`

### Development with HTTPS
```bash
# Linux/macOS
HTTPS=true npm start

# Windows
set HTTPS=true && npm start
```

### Build for Production
```bash
npm run build
# or
yarn build
```

## 🧩 Component Architecture

### Core Components

#### AuthContext
Manages authentication state and provides auth methods:
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
  verifyRole: () => Promise<void>;
}
```

#### CartContext
Manages shopping cart state:
```typescript
interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
}
```

### Page Components

#### HomePage
- Product listing with search and filters
- Category navigation
- Featured products section
- Quick add to cart functionality

#### AdminPage
- Tab-based interface for admin functions
- Product management (CRUD operations)
- User management (view, promote to admin)
- System statistics dashboard

#### CartPage
- Cart item display with quantity controls
- Price calculations
- Checkout process initiation
- Empty cart handling

## 🔄 State Management

### Context Architecture
```
┌─────────────────────────────────────────┐
│              App Component              │
└────────────────┬───────────────────────┘
                 │
     ┌───────────▼────────────┐
     │     AuthContext        │
     │  - User state          │
     │  - Auth methods        │
     └───────────┬────────────┘
                 │
     ┌───────────▼────────────┐
     │     CartContext        │
     │  - Cart state          │
     │  - Cart methods        │
     └───────────┬────────────┘
                 │
     ┌───────────▼────────────┐
     │    Route Components    │
     └────────────────────────┘
```

### Local State Management
- Component state with `useState`
- Complex state with `useReducer`
- Form state with React Hook Form
- Async state with custom hooks

## 🔐 Authentication Flow

### Login Process
```
User Input ──► Login API ──► JWT Token ──► Store Token ──► Update Context ──► Redirect
    │              │              │             │               │
    └── Validate   └── Error      └── LocalStorage  └── User State
```

### Protected Routes
```typescript
const PrivateRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  
  return user ? <>{children}</> : <Navigate to="/login" />;
};
```

## 🛣️ Routing

### Route Structure
```typescript
<Routes>
  {/* Public Routes */}
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  
  {/* Protected Routes */}
  <Route element={<PrivateRoute />}>
    <Route path="/" element={<HomePage />} />
    <Route path="/products" element={<ProductPage />} />
    <Route path="/cart" element={<CartPage />} />
    <Route path="/orders" element={<OrdersPage />} />
  </Route>
  
  {/* Admin Routes */}
  <Route element={<AdminRoute />}>
    <Route path="/admin" element={<AdminPage />} />
  </Route>
  
  {/* 404 */}
  <Route path="*" element={<NotFoundPage />} />
</Routes>
```

## 🔌 API Integration

### Service Layer Pattern
```typescript
// productService.ts
export const productService = {
  getAll: async (): Promise<Product[]> => {
    const response = await API.get('/product');
    return response.data;
  },
  
  getById: async (id: number): Promise<Product> => {
    const response = await API.get(`/product/${id}`);
    return response.data;
  },
  
  create: async (product: CreateProductDto): Promise<Product> => {
    const response = await API.post('/product/add', product);
    return response.data;
  },
  
  update: async (id: number, product: UpdateProductDto): Promise<void> => {
    await API.put(`/product/${id}`, product);
  },
  
  delete: async (id: number): Promise<void> => {
    await API.delete(`/product/${id}`);
  }
};
```

### Error Handling
```typescript
const handleApiError = (error: any): string => {
  if (error.response) {
    // Server responded with error
    return error.response.data.message || 'Server error occurred';
  } else if (error.request) {
    // Request made but no response
    return 'Network error - please check your connection';
  } else {
    // Something else happened
    return 'An unexpected error occurred';
  }
};
```

## 📦 Build & Deployment

### Build Process
```bash
# Create production build
npm run build

# Analyze bundle size
npm run build -- --stats
```

### Deployment Options

#### 1. Static Hosting (Netlify/Vercel)
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy --prod --dir=build
```

#### 2. Docker Deployment
```dockerfile
# Dockerfile
FROM node:14-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 3. CI/CD Pipeline
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '14'
      - run: npm ci
      - run: npm run build
      - name: Deploy to hosting
        run: # deployment command
```

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
**Error**: "Access to XMLHttpRequest blocked by CORS policy"

**Solutions**:
1. Verify backend CORS configuration includes frontend URL
2. Check if credentials are being sent correctly:
```typescript
// In api.ts
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true, // If using cookies
});
```
3. Use proxy in development:
```json
// In package.json
"proxy": "http://localhost:5205"
```

#### 2. Authentication Issues
**Error**: "401 Unauthorized" or "Token expired"

**Solutions**:
1. Check token storage and retrieval:
```typescript
// Debug token
console.log('Token:', localStorage.getItem('token'));
console.log('Token expiry:', parseJwt(token).exp);
```
2. Implement token refresh logic:
```typescript
// In AuthContext
const refreshToken = async () => {
  try {
    const response = await API.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('token', token);
    return token;
  } catch (error) {
    logout();
    throw error;
  }
};
```

#### 3. State Not Updating
**Error**: Component not re-rendering after state change

**Solutions**:
1. Check for state mutations:
```typescript
// Wrong
state.items.push(newItem);

// Correct
setState(prev => ({
  ...prev,
  items: [...prev.items, newItem]
}));
```
2. Use React DevTools to inspect state
3. Verify context provider placement

#### 4. Build Failures
**Error**: "Module not found" or TypeScript errors

**Solutions**:
1. Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```
2. Check TypeScript configuration:
```json
// tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```
3. Verify import paths are correct

#### 5. Performance Issues
**Problem**: Slow rendering or lag

**Solutions**:
1. Implement React.memo for expensive components:
```typescript
const ProductCard = React.memo(({ product }) => {
  // component code
});
```
2. Use useMemo and useCallback:
```typescript
const expensiveValue = useMemo(() => {
  return calculateExpensive(data);
}, [data]);
```
3. Lazy load components:
```typescript
const AdminPage = lazy(() => import('./pages/AdminPage'));
```
4. Implement virtualization for long lists

### Environment-Specific Issues

#### Development Environment
```bash
# Port already in use
lsof -ti:3000 | xargs kill -9

# Clear React cache
rm -rf .cache
rm -rf node_modules/.cache
```

#### Production Build
```bash
# Analyze bundle size
npm install --save-dev source-map-explorer
npm run build
npm run analyze
```

### Browser-Specific Issues

#### Safari Private Mode
- LocalStorage not available
- Implement fallback to sessionStorage or cookies

#### IE11 Support (if required)
```bash
# Install polyfills
npm install react-app-polyfill

# In index.tsx
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
```

### Debugging Tools

#### React Developer Tools
1. Install browser extension
2. Inspect component props and state
3. Profile performance

#### Network Debugging
```typescript
// Add request/response logging
API.interceptors.request.use(request => {
  console.log('Starting Request:', request);
  return request;
});

API.interceptors.response.use(
  response => {
    console.log('Response:', response);
    return response;
  },
  error => {
    console.log('Error:', error.response);
    return Promise.reject(error);
  }
);
```

## 👨‍💻 Development Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use Prettier for formatting
- Implement proper error boundaries
- Write meaningful component names

### Component Guidelines
```typescript
// Good component structure
interface ProductCardProps {
  product: Product;
  onAddToCart?: (productId: number) => void;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onAddToCart,
  className 
}) => {
  // Component logic
};

// Export types with component
export type { ProductCardProps };
export default ProductCard;
```

### State Management Best Practices
1. Keep state as local as possible
2. Lift state only when necessary
3. Use context for truly global state
4. Avoid prop drilling
5. Implement proper loading states

### Performance Optimization
1. Memoize expensive calculations
2. Debounce API calls
3. Implement proper loading states
4. Use code splitting
5. Optimize images and assets

### Git Workflow
```bash
# Feature branch
git checkout -b feature/new-feature

# Commit with conventional commits
git commit -m "feat: add product filtering"
git commit -m "fix: resolve cart update issue"
git commit -m "docs: update README"

# Push and create PR
git push origin feature/new-feature
```