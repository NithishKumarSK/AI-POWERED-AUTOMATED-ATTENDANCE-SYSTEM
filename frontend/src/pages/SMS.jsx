import React from 'react';
import Sidebar from '../components/Sidebar';
import { Mail, CheckCircle, BellRing } from 'lucide-react';

const SMS = () => {
  const authRole = localStorage.getItem('auth_role') || 'student';

  if (authRole === 'student') return null;

  return (
    <div className="min-h-screen bg-[#0b0e14] font-sans text-gray-200 flex">
      <Sidebar />
      <div className="ml-64 flex-1 p-12 overflow-y-auto">
        <div className="max-w-[1000px] mx-auto space-y-6">
          
          <div className="bg-[#161b22] border border-[#30363d] p-6 rounded-xl flex justify-between items-center shadow-sm">
             <div>
                <h1 className="text-2xl font-bold text-gray-100 flex items-center gap-3">
                   <Mail className="w-6 h-6 text-blue-500" />
                   SMS / Notification Hub
                </h1>
                <p className="text-gray-400 text-sm mt-2">API Output for external Guardian Notification Bridges</p>
             </div>
             <div className="bg-[#1f2937]/50 border border-[#30363d] px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2">
                <BellRing className="w-4 h-4 text-green-500" /> Active Bridge
             </div>
          </div>

          <div className="bg-[#161b22] border border-[#30363d] rounded-xl overflow-hidden shadow-sm flex flex-col items-center justify-center py-20">
             <CheckCircle className="w-16 h-16 text-[#3fb950] mb-6" />
             <h3 className="text-2xl font-semibold text-gray-200">Terminal Logging Only</h3>
             <p className="text-gray-400 font-medium mt-4 max-w-lg text-center">
                The Twilio/WhatsApp transmission layers are currently operating in Console-Mode natively inside the backend Python application. Please view the Terminal output to examine the SMS headers payload!
             </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SMS;
