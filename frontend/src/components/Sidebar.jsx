import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, ScanEye, LogOut, ChevronDown, ChevronRight, CheckCircle2, Video, GraduationCap, ClipboardList, BookOpen, LineChart, FileText, MessageSquare, ClipboardEdit } from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const authRole = localStorage.getItem('auth_role') || 'student';
  const authId = localStorage.getItem('auth_id') || 'GUEST';

  const [displayName, setDisplayName] = useState(authId);
  const [academicsOpen, setAcademicsOpen] = useState(true); // Dropdown state

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
        setDisplayName(authId);
     }
  }, [authId, authRole]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const NavItem = ({ name, path, icon: Icon, isSub = false }) => {
     const isActive = location.pathname === path || (path === '/home' && location.pathname === '/');
     return (
        <NavLink
          key={name}
          to={path}
          className={`flex items-center px-4 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
            isActive 
            ? 'bg-[#1e293b] text-white shadow-sm border border-[#334155]' 
            : 'text-gray-400 hover:text-gray-200 hover:bg-[#161b22]'
          } ${isSub ? 'ml-6' : ''}`}
        >
          <Icon className={`w-4 h-4 mr-3 ${isActive ? 'text-blue-400' : 'opacity-70'}`} />
          <span className="truncate">{name}</span>
        </NavLink>
     )
  };

  return (
    <div className="w-64 bg-[#0b0e14] h-screen fixed left-0 top-0 border-r border-[#1f2937] flex flex-col font-sans select-none overflow-y-auto custom-scrollbar">
      
      {/* Brand Logo Header */}
      <div className="min-h-[80px] flex items-center px-6 border-b border-[#1f2937] sticky top-0 bg-[#0b0e14] z-10">
        <div className="w-8 h-8 bg-[#238636] rounded flex items-center justify-center mr-3 shadow-lg shadow-[#238636]/20">
           <span className="text-white font-black text-sm">TK</span>
        </div>
        <span className="text-white text-xl font-bold tracking-wide">TKREC ERP</span>
      </div>

      {/* Profile Summary */}
      <div className="p-6 pb-2">
         <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#1e293b] flex items-center justify-center text-slate-400 border border-[#334155] shrink-0">
               {authRole === 'staff' ? '👨‍🏫' : '🧑‍🎓'}
            </div>
            <div className="overflow-hidden">
               <div className="text-gray-200 text-sm font-bold truncate">{displayName}</div>
               <div className="text-[#2ea043] text-xs font-bold uppercase tracking-wider">{authRole}</div>
            </div>
         </div>
      </div>

      {/* Nav Links */}
      <div className="flex-1 px-4 py-4 space-y-1 overflow-x-hidden">
        
        {authRole === 'staff' ? (
           <>
              {/* Core Original Tabs + New Mentoring/Dashboard mappings */}
              <NavItem name="Home" path="/home" icon={LayoutDashboard} />
              <NavItem name="Details" path="/details" icon={Users} />
              <NavItem name="TimeTable" path="/timetable" icon={Calendar} />
              <NavItem name="Nominal Rolls" path="/nominal-rolls" icon={ClipboardList} />

              {/* Academics Dropdown Section */}
              <div className="pt-2 pb-1">
                 <div 
                   onClick={() => setAcademicsOpen(!academicsOpen)}
                   className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-gray-200 hover:bg-[#161b22] cursor-pointer transition-colors"
                 >
                   <div className="flex items-center">
                      <GraduationCap className="w-4 h-4 mr-3 opacity-70" />
                      <span>Academics</span>
                   </div>
                   {academicsOpen ? <ChevronDown className="w-4 h-4 opacity-50" /> : <ChevronRight className="w-4 h-4 opacity-50" />}
                 </div>
                 
                 {academicsOpen && (
                    <div className="mt-1 space-y-1 border-l-2 border-[#1f2937] ml-6 pl-2">
                       <NavItem name="Lecture Planning" path="/lecture-planning" icon={BookOpen} />
                       <NavItem name="Attendance (AI)" path="/attendance" icon={ScanEye} />
                       <NavItem name="Register" path="/register-academic" icon={ClipboardEdit} />
                       <NavItem name="Activity Diary" path="/activity-diary" icon={FileText} />
                       <NavItem name="Taken Classes" path="/taken-classes" icon={CheckCircle2} />
                       <NavItem name="Class Adjustment" path="/class-adjustment" icon={Users} />
                       <NavItem name="MID Marks" path="/mid-marks" icon={LineChart} />
                       <NavItem name="E MID Marks" path="/e-mid-marks" icon={LineChart} />
                    </div>
                 )}
              </div>

              {/* Bottom Section Tabs */}
              <NavItem name="Mentoring" path="/mentoring" icon={Users} />
              <NavItem name="Attainments" path="/attainments" icon={LineChart} />
              <NavItem name="Feedback" path="/feedback" icon={MessageSquare} />
              <NavItem name="Results" path="/results" icon={FileText} />
              <NavItem name="Reports" path="/reports" icon={ClipboardList} />
           </>
        ) : (
           <>
              {/* STUDENT EXTENDED TABS */}
              <NavItem name="Home" path="/home" icon={LayoutDashboard} />
              <NavItem name="Details" path="/details" icon={Users} />
              <NavItem name="TimeTable" path="/timetable" icon={Calendar} />
              <NavItem name="Attendance" path="/attendance" icon={ScanEye} />
              <NavItem name="Marks" path="/marks" icon={LineChart} />
              <NavItem name="Feedback" path="/feedback" icon={MessageSquare} />
              <NavItem name="SMS" path="/sms" icon={MessageSquare} />
              <NavItem name="Results" path="/results" icon={FileText} />
              <NavItem name="Course Exit" path="/course-exit" icon={LogOut} />
              <NavItem name="Voting" path="/voting" icon={CheckCircle2} />

              {/* --- STUDENT ONLY: ONE-TIME FACE REGISTRATION --- */}
              <div className="pt-6">
                 <div className="text-xs font-bold text-gray-500 uppercase tracking-widest pl-4 mb-2">Security</div>
                 <NavLink
                   to="/face-setup"
                   className="flex items-center px-4 py-3 rounded-xl text-sm font-bold transition-all bg-[#238636]/10 text-[#2ea043] hover:bg-[#238636]/20 border border-[#2ea043]/30 shadow-[#2ea043]/5 shadow-lg"
                 >
                   <Video className="w-4 h-4 mr-3" />
                   360° Face Setup
                 </NavLink>
              </div>
           </>
        )}

      </div>

      {/* Footer Nav */}
      <div className="p-4 border-t border-[#1f2937] bg-[#0b0e14] sticky bottom-0 z-10">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm text-gray-400 font-medium hover:text-red-400 hover:bg-[#161b22] rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 mr-3 opacity-70" />
          Secure Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
