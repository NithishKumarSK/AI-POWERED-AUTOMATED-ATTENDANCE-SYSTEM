import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, AlertCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Fetch call directly authenticates via the raw SQLite /auth/login portal
    fetch('http://127.0.0.1:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      setIsLoading(false);
      if (data.status === 'ok') {
        localStorage.setItem('auth_role', data.user.role);
        localStorage.setItem('auth_id', data.user.user_id);
        navigate('/home');
      } else {
        setError(data.message);
      }
    })
    .catch(err => {
      setIsLoading(false);
      setError(`Database Offline. Start the backend: ${err.message}`);
    });
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center font-sans">
      
      <div className="w-full max-w-sm">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#238636] rounded-xl flex items-center justify-center mb-4 shadow-sm border border-[#2ea043]">
             <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Sign in to TKREC AI ERP
          </h1>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm">
          
          {error && (
            <div className="mb-4 p-3 bg-[#ff7b72]/10 border border-[#ff7b72]/30 rounded-lg flex items-start gap-2">
               <AlertCircle className="w-5 h-5 text-[#ff7b72] flex-shrink-0" />
               <span className="text-sm font-medium text-[#ff7b72]">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
               <label className="block text-sm font-semibold text-gray-200 mb-1.5">Network Identity ID</label>
               <input 
                  type="text" 
                  required
                  value={formData.user_id}
                  onChange={e => setFormData({...formData, user_id: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>
            <div>
               <label className="block text-sm font-semibold text-gray-200 mb-1.5">Passkey</label>
               <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>

            <button disabled={isLoading} type="submit" className="w-full mt-2 py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] text-white text-sm font-semibold transition-colors flex items-center justify-center">
               {isLoading ? 'Authenticating...' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="mt-8 p-4 bg-[#161b22] border border-[#30363d] border-transparent rounded-xl text-center shadow-sm">
           <span className="text-gray-400 text-sm">New to TKREC ERP Systems? </span>
           <span onClick={() => navigate('/register')} className="text-blue-500 hover:text-blue-400 font-semibold text-sm cursor-pointer">Create an account.</span>
        </div>

      </div>
    </div>
  );
};

export default Login;
