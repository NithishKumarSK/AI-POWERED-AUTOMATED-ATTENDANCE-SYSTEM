import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [displayName, setDisplayName] = useState(authId);

  useEffect(() => {
     if (authRole === 'student') {
        fetch(`http://127.0.0.1:5000/api/students/${authId}/stats`)
          .then(res => res.json())
          .then(data => {
             if(data && data.full_name && data.full_name !== 'Unknown') {
                 setDisplayName(data.full_name);
             }
          }).catch(err => console.error(err));
     } else {
        setDisplayName(`Prof. ${authId}`);
     }
  }, [authId, authRole]);

  const tabs = [
    { name: 'Dashboard', path: '/home' },
    { name: 'Profile Details', path: '/details' },
    { name: 'TimeTable', path: '/timetable' },
    { name: 'Ai Attendance', path: '/attendance', strictStaff: false }, 
  ];

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <nav className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 text-slate-200 flex justify-between items-center py-4 px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-8">
        <div className="flex items-center text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-teal-400">
          AI ERP.
        </div>
        <div className="flex space-x-2">
          {tabs.map((tab) => {
            if (tab.strictStaff && authRole === 'student') return null;
            return (
              <NavLink
                key={tab.name}
                to={tab.path}
                className={({ isActive }) =>
                  `px-4 py-2 text-sm font-bold transition-all rounded-xl ${
                    isActive ? 'bg-white/10 text-teal-400 border border-white/5 shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {tab.name}
              </NavLink>
            );
          })}
        </div>
      </div>
      <div className="flex items-center space-x-2 relative">
        <div 
          className={`text-sm font-bold cursor-pointer flex items-center bg-white/5 border px-4 py-2 rounded-xl transition-colors hover:bg-white/10 ${authRole === 'staff' ? 'text-blue-400 border-blue-500/30' : 'text-teal-400 border-teal-500/30'}`}
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <span className="mr-2 opacity-50 text-xs">[{authRole.toUpperCase()}]</span> {displayName} <span className="ml-2 text-xs">▼</span>
        </div>
        
        {dropdownOpen && (
          <div className="absolute top-12 right-0 w-40 bg-[#1e293b] rounded-xl shadow-2xl border border-white/10 z-50 overflow-hidden backdrop-blur-xl">
            <button 
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-sm text-red-400 font-bold hover:bg-white/5 transition-colors"
            >
              Secure Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
