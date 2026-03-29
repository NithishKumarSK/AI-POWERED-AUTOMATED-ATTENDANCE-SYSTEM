import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fingerprint, AlertCircle } from 'lucide-react';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: '',
    password: '',
    role: 'student',
    full_name: ''
  });
  const [error, setError] = useState('');

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');
    fetch('http://127.0.0.1:5000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === 'ok') {
        navigate('/');
      } else {
        setError(data.message);
      }
    })
    .catch(err => setError(`Network Error: ${err.message}`));
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center font-sans">
      
      <div className="w-full max-w-md">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#238636] rounded-xl flex items-center justify-center mb-4 shadow-sm border border-[#2ea043]">
             <Fingerprint className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-100 tracking-tight">
            Register TKREC AI Node
          </h1>
        </div>

        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 shadow-sm">
          
          {error && (
            <div className="mb-4 p-3 bg-[#ff7b72]/10 border border-[#ff7b72]/30 rounded-lg flex items-start gap-2">
               <AlertCircle className="w-5 h-5 text-[#ff7b72] flex-shrink-0" />
               <span className="text-sm font-medium text-[#ff7b72]">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="mb-6 border-b border-[#30363d] pb-6">
               <label className="block text-sm font-semibold text-gray-200 mb-2">Access Level</label>
               <div className="flex gap-4">
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, role: 'student'})}
                   className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${formData.role === 'student' ? 'bg-[#1f2937] text-gray-100 border-[#30363d]' : 'bg-[#0d1117] text-gray-500 border-transparent hover:text-gray-300'}`}
                 >
                   Student
                 </button>
                 <button 
                   type="button"
                   onClick={() => setFormData({...formData, role: 'staff'})}
                   className={`flex-1 py-2 text-sm font-semibold rounded-lg border ${formData.role === 'staff' ? 'bg-[#1f2937] text-gray-100 border-[#30363d]' : 'bg-[#0d1117] text-gray-500 border-transparent hover:text-gray-300'}`}
                 >
                   Faculty
                 </button>
               </div>
            </div>

            <div>
               <label className="block text-sm font-semibold text-gray-200 mb-1.5">Full Name</label>
               <input 
                  type="text" 
                  required
                  value={formData.full_name}
                  onChange={e => setFormData({...formData, full_name: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>
            
            <div>
               <label className="block text-sm font-semibold text-gray-200 mb-1.5">Node ID (e.g., 23R91A05L6)</label>
               <input 
                  type="text" 
                  required
                  value={formData.user_id}
                  onChange={e => setFormData({...formData, user_id: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>
            
            <div className="pb-4">
               <label className="block text-sm font-semibold text-gray-200 mb-1.5">Passkey</label>
               <input 
                  type="password" 
                  required
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                  className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-blue-500 transition-colors"
               />
            </div>

            <button type="submit" className="w-full py-2.5 rounded-lg bg-[#238636] hover:bg-[#2ea043] border border-[rgba(240,246,252,0.1)] text-white text-sm font-semibold transition-colors flex items-center justify-center">
               Confirm Registration
            </button>
          </form>
        </div>

        <div className="mt-8 p-4 bg-[#161b22] border border-[#30363d] border-transparent rounded-xl text-center shadow-sm">
           <span className="text-gray-400 text-sm">Valid clearance code? </span>
           <span onClick={() => navigate('/')} className="text-blue-500 hover:text-blue-400 font-semibold text-sm cursor-pointer">Sign in.</span>
        </div>

      </div>
    </div>
  );
};

export default Register;
