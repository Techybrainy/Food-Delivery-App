import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext.tsx';
import { CartProvider, CartContext } from './context/CartContext.tsx';
import Home from './pages/Home.tsx';
import RestaurantDetails from './pages/RestaurantDetails.tsx';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login.tsx';
import { Utensils, ShoppingBag, User } from 'lucide-react';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const { items } = useContext(CartContext);
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="h-16 border-b border-line bg-surface sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-4 group">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#4cc9f0] to-[#4361ee] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(76,201,240,0.4)]">
               <Utensils className="w-4 h-4" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-text-primary">FoodApp <span className="text-text-dim text-xs font-normal mono-label ml-2 hidden sm:inline">Engine v1.0.0</span></span>
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/cart" className="relative text-text-dim hover:text-accent transition-colors flex items-center">
            <span className="mono-label mr-2 hidden sm:inline">Checkout</span>
            <ShoppingBag className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-accent text-bg text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </Link>
          <div className="w-px h-6 bg-line hidden sm:block"></div>
          {user ? (
            <div className="flex flex-col items-end">
              <span className="text-xs text-text-primary hidden sm:block">USR_{user.name.toUpperCase()}</span>
              <button 
                onClick={logout}
                className="text-[10px] font-mono text-text-dim hover:text-accent transition-colors mt-0.5"
              >
                [ TERMINATE_SESSION ]
              </button>
            </div>
          ) : (
            <Link to="/login" className="flex items-center gap-2 text-text-dim hover:text-accent group">
               <User className="w-4 h-4"/>
               <span className="hidden sm:block text-xs font-mono group-hover:text-accent transition-colors">[ AUTHENTICATE ]</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-bg text-text-primary flex flex-col overflow-x-hidden">
            <Navigation />
            <main className="flex-1 grid-bg p-4 sm:p-6 lg:p-8">
              <Routes>
                 <Route path="/" element={<Home />} />
                 <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                 <Route path="/cart" element={<Cart />} />
                 <Route path="/login" element={<Login />} />
              </Routes>
            </main>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
