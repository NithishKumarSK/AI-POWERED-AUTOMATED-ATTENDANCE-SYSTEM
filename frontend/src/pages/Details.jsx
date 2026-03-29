import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import { UserCircle, Terminal, Key, ShieldCheck } from 'lucide-react';

const Details = () => {
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authRole === 'student') {
      fetch(`http://127.0.0.1:5000/api/students/${authId}/stats`)
        .then(res => res.json())
        .then(data => setProfile(data))
        .catch(err => console.error(err));
    } else {
      setProfile({
         full_name: 'Dr. Professor Admin',
         class_id: 'All Hubs',
         rank: 'Senior AI System Administrator',
         access_level: 'Level 5 (Override Privileges)'
      });
    }
  }, [authId, authRole]);

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-12 overflow-y-auto">
         
         <div className="max-w-4xl bg-[#161b22] border border-[#30363d] rounded-2xl p-1 lg:p-12 relative shadow-sm">
            <div className="flex flex-col md:flex-row gap-12 items-center">
               
               <div className="relative w-48 h-48 flex-shrink-0">
                  <div className="relative w-full h-full bg-[#0d1117] rounded-full flex items-center justify-center border-4 border-[#30363d]">
                     {authRole === 'staff' ? (
                       <ShieldCheck className="w-20 h-20 text-blue-500" />
                     ) : (
                       <UserCircle className="w-20 h-20 text-blue-400" />
                     )}
                  </div>
               </div>

               <div className="flex-1 space-y-6 text-center md:text-left">
                  <div>
                     <div className={`inline-block px-3 py-1 rounded text-xs font-semibold tracking-wider mb-4 ${authRole === 'staff' ? 'bg-[#1f2937] text-blue-400 border border-[#30363d]' : 'bg-[#1f2937] text-[#3fb950] border border-[#30363d]'}`}>
                        {authRole.toUpperCase()} CLEARANCE
                     </div>
                     <h1 className="text-4xl font-bold text-gray-100">{profile?.full_name || 'Authenticating...'}</h1>
                     <p className="text-gray-400 font-mono text-lg mt-2 flex items-center justify-center md:justify-start gap-2">
                        <Key className="w-4 h-4 opacity-50"/> {authId}
                     </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                     {authRole === 'student' ? (
                        <>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">Registered Hub</span>
                              <span className="text-lg font-medium text-gray-200">{profile?.class_id || 'N/A'}</span>
                           </div>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">AI Attendance Score</span>
                              <span className="text-lg font-bold text-blue-500">{profile ? (profile.percentage * 100).toFixed(2) : 0}%</span>
                           </div>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">Total Classes Taken</span>
                              <span className="text-lg font-medium text-gray-200">{profile?.total_periods || 0}</span>
                           </div>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">Facial Map Standing</span>
                              <span className="text-lg font-bold text-[#3fb950] tracking-wide flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#3fb950]"></span> 360-VALID
                              </span>
                           </div>
                        </>
                     ) : (
                        <>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl sm:col-span-2">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">Access Protocol</span>
                              <span className="text-lg font-medium text-gray-200 flex items-center gap-2">
                                <Terminal className="w-4 h-4 text-blue-500"/> {profile?.access_level}
                              </span>
                           </div>
                           <div className="bg-[#0d1117] border border-[#30363d] p-4 rounded-xl sm:col-span-2">
                              <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider block mb-1">Assigned Title</span>
                              <span className="text-lg font-medium text-blue-400">{profile?.rank}</span>
                           </div>
                        </>
                     )}
                  </div>
               </div>

            </div>
         </div>
      </div>
    </div>
  );
};

export default Details;
