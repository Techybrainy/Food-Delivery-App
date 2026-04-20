import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext.tsx';
import api from '../api.ts';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const payload = isLogin ? { email, password } : { name, email, password };
      const response = await api.post(endpoint, payload);
      
      login(response.data.token, response.data.user);
      navigate('/');
    } catch (error: any) {
      alert(error.response?.data?.error || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 glass glow-border p-8 md:p-10 rounded-lg card relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent opacity-50"></div>
        <div>
          <span className="mono-label tracking-widest block text-center mb-2">AUTH_GATEWAY</span>
          <h2 className="text-center text-3xl font-light text-text-primary">
            {isLogin ? 'Establish Connection' : 'Initialize Account'}
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {!isLogin && (
               <div>
                  <label className="mono-label text-text-dim text-[10px] block mb-1">USER_IDENTIFIER</label>
                  <input
                    name="name"
                    type="text"
                    required
                    className="appearance-none block w-full px-4 py-3 border border-line bg-surface text-text-primary rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono text-sm sm:text-sm transition-colors"
                    placeholder="Enter full name..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
               </div>
            )}
            <div>
              <label className="mono-label text-text-dim text-[10px] block mb-1">COMM_NODE_ADDRESS</label>
              <input
                name="email"
                type="email"
                required
                className="appearance-none block w-full px-4 py-3 border border-line bg-surface text-text-primary rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono text-sm sm:text-sm transition-colors"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="mono-label text-text-dim text-[10px] block mb-1">SECURITY_KEY</label>
              <input
                name="password"
                type="password"
                required
                className="appearance-none block w-full px-4 py-3 border border-line bg-surface text-text-primary rounded focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent font-mono text-sm sm:text-sm transition-colors"
                placeholder="Enter passphrase..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="group w-full flex justify-center py-3 px-4 border border-accent/50 text-sm font-mono rounded text-accent bg-accent/10 hover:bg-accent/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-bg focus:ring-accent transition-all shadow-[0_0_15px_rgba(76,201,240,0.1)] hover:shadow-[0_0_20px_rgba(76,201,240,0.3)]"
            >
              {isLogin ? '[ AUTHENTICATE ]' : '[ REGISTER_NODE ]'}
            </button>
          </div>
          
          <div className="text-center text-xs font-mono mt-6">
             <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-text-dim hover:text-accent transition-colors">
               {isLogin ? "// INIT_NEW_CONNECTION" : "// RE_ESTABLISH_CONNECTION"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
