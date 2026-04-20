import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api.ts';
import { Store, Star } from 'lucide-react';

interface Restaurant {
  id: number;
  name: string;
  description: string;
  location: string;
  image_url: string;
}

const Home = () => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const response = await api.get('/restaurants');
        setRestaurants(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurants");
      }
    };
    fetchRestaurants();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl font-light tracking-tight text-text-primary mb-2">
          Available Modules
        </h1>
        <p className="text-sm text-text-dim max-w-2xl font-mono">
          // BROWSE_NETWORK_RESTAURANTS
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {restaurants.map((r) => (
          <Link key={r.id} to={`/restaurant/${r.id}`} className="group block">
            <div className="glass glow-border rounded-lg overflow-hidden flex flex-col h-full card">
              <div className="relative h-48 w-full overflow-hidden border-b border-line">
                <img
                  src={r.image_url}
                  alt={r.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg/90 to-transparent"></div>
                <div className="absolute top-3 right-3 flex items-center bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-line">
                   <Star className="w-3 h-3 mr-1 text-accent fill-current" />
                   <span className="text-[10px] font-mono text-accent">4.8</span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="mono-label mb-2 block tracking-wider">NODE_{r.id.toString().padStart(3, '0')}</span>
                <h3 className="text-xl font-light text-text-primary mb-2 group-hover:text-accent transition-colors">{r.name}</h3>
                <p className="text-text-dim text-xs leading-relaxed mb-4 flex-1">{r.description}</p>
                <div className="flex items-center text-xs font-mono text-accent border-t border-line/50 pt-3">
                  <span className="opacity-50 mr-2">📍</span>
                  {r.location.toUpperCase()}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;
