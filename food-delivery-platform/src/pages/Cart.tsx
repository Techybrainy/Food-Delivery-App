import React, { useContext, useState } from 'react';
import { CartContext } from '../context/CartContext.tsx';
import { AuthContext } from '../context/AuthContext.tsx';
import { useNavigate } from 'react-router-dom';
import api from '../api.ts';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const { items, removeFromCart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    if (items.length === 0) return;

    setLoading(true);
    try {
      await api.post('/orders', { items, total });
      clearCart();
      alert('Order placed successfully!');
      navigate('/');
    } catch (error) {
      alert('Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="glass glow-border rounded-lg p-12 border-dashed border-line">
          <span className="mono-label tracking-widest block mb-4">SYSTEM_STATUS_IDLE</span>
          <h2 className="text-2xl font-light text-text-primary mb-2">Cart Memory Empty</h2>
          <p className="text-text-dim mb-8 font-mono text-sm">// No items detected in current session.</p>
          <button onClick={() => navigate('/')} className="bg-accent/10 text-accent border border-accent hover:bg-accent/20 font-mono px-6 py-2 rounded transition-colors text-sm">
            [ INITIALIZE_BROWSE ]
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8 border-b border-line pb-4 flex justify-between items-end">
        <h2 className="text-3xl font-light text-text-primary">Order Pipeline</h2>
        <span className="mono-label hidden sm:block">STATUS: PENDING_CHECKOUT</span>
      </div>
      
      <div className="glass glow-border rounded-lg p-4 sm:p-6 mb-6 card">
        <ul className="divide-y divide-line/50">
          {items.map((item) => (
            <li key={item.id} className="py-4 flex justify-between items-center group">
              <div>
                <span className="mono-label text-text-dim text-[10px] mb-1 block">ID_{item.id.toString().padStart(4, '0')}</span>
                <h4 className="font-light text-text-primary text-lg">{item.name}</h4>
                <p className="text-xs text-text-dim font-mono mt-1">QTY: {item.quantity} <span className="opacity-50 mx-1">|</span> UNIT_VAL: ${(item.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-6">
                <span className="font-mono text-accent">${(item.price * item.quantity).toFixed(2)}</span>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-text-dim hover:text-[#ff4444] transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="border-t border-line mt-4 pt-4 flex justify-between items-center bg-surface/50 -mx-4 sm:-mx-6 px-4 sm:px-6 pb-2 rounded-b-lg">
          <span className="mono-label text-text-dim text-sm">TOTAL_VALUE</span>
          <span className="font-mono text-2xl text-accent shadow-accent-glow drop-shadow-md">${total.toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        onClick={handleCheckout} 
        disabled={loading}
        className="w-full bg-accent/20 hover:bg-accent/30 disabled:opacity-50 text-accent font-mono py-4 rounded border border-accent/50 transition-colors shadow-[0_0_15px_rgba(76,201,240,0.2)] hover:shadow-[0_0_25px_rgba(76,201,240,0.4)]"
      >
        {loading ? '[ PROCESSING_TRANSACTION... ]' : '[ EXECUTE_ORDER ]'}
      </button>
    </div>
  );
};

export default Cart;
