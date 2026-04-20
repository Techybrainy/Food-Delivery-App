import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api.ts';
import { CartContext } from '../context/CartContext.tsx';
import { Plus } from 'lucide-react';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image_url: string;
  menu: MenuItem[];
}

const RestaurantDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        const response = await api.get(`/restaurants/${id}`);
        setRestaurant(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurant");
      }
    };
    fetchRestaurant();
  }, [id]);

  if (!restaurant) return <div className="p-8 text-center text-gray-500">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="glass glow-border rounded-lg overflow-hidden h-64 md:h-80 mb-8 relative card">
        <div className="absolute inset-0 pointer-events-none">
          <img
            src={restaurant.image_url}
            alt={restaurant.name}
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent"></div>
        </div>
        <div className="relative h-full flex flex-col justify-end p-6 md:p-8">
          <span className="mono-label mb-2 block tracking-widest">DETAILS_NODE_{restaurant.id.toString().padStart(3, '0')}</span>
          <h1 className="text-4xl md:text-5xl font-light mb-4 text-text-primary">{restaurant.name}</h1>
          <p className="text-sm md:text-base text-text-dim max-w-2xl font-mono">// {restaurant.description}</p>
        </div>
      </div>

      <div className="mb-6 flex items-center border-b border-line pb-4">
        <span className="mono-label tracking-widest text-text-dim border border-line px-3 py-1 rounded bg-surface">AVAILABLE_ITEMS</span>
        <div className="ml-4 h-px bg-line flex-1"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {restaurant.menu.map((item) => (
          <div key={item.id} className="glass glow-border p-5 rounded-lg flex justify-between items-center group card">
            <div className="pr-4">
              <span className="mono-label text-text-dim text-[9px] mb-1 block">ID_{item.id.toString().padStart(4, '0')}</span>
              <h3 className="font-light text-text-primary text-lg group-hover:text-accent transition-colors">{item.name}</h3>
              <p className="text-xs text-text-dim mt-2 font-mono leading-relaxed">{item.description}</p>
            </div>
            <div className="flex flex-col items-end pl-4 border-l border-line/50 h-full justify-between py-1 min-w-[80px]">
              <span className="font-mono text-accent text-sm mb-4">${item.price.toFixed(2)}</span>
              <button
                onClick={() => addToCart({ id: item.id, name: item.name, price: item.price, restaurant_id: restaurant.id })}
                className="hover:bg-accent/20 text-accent border border-accent/50 p-2 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-accent"
                aria-label="Add to cart"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RestaurantDetails;
