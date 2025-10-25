import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, BarChart3, FileCheck, Upload, FileText, Award, 
  Calculator, Newspaper, Globe, Phone, HelpCircle, Settings, 
  LogOut 
} from 'lucide-react';

function Sidebar({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      section: 'MAIN MENU',
      items: [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics' }
      ]
    },
    {
      section: 'DOCUMENT SERVICES',
      items: [
        { icon: FileCheck, label: 'Generate Docs', path: '/document-generator' },
        { icon: Upload, label: 'Upload Documents', path: '/document-upload' },
        { icon: FileText, label: 'My Documents', path: '/documents' }
      ]
    },
    {
      section: 'TOOLS & RESOURCES',
      items: [
        { icon: Award, label: 'ERI Assessment', path: '/export-readiness-index' },
        { icon: Calculator, label: 'Duty Calculator', path: '/duty-calculator' },
        { icon: Newspaper, label: 'Export News', path: '/news' },
        { icon: Globe, label: 'New Markets', path: '/markets' }
      ]
    },
    {
      section: 'SUPPORT',
      items: [
        { icon: Phone, label: 'Contact Us', path: '/contact' },
        { icon: HelpCircle, label: 'Help & FAQs', path: '/help' },
        { icon: Settings, label: 'Settings', path: '/settings' }
      ]
    }
  ];

  return (
    <aside className="w-64 h-screen bg-[#1a3a2e] text-white flex flex-col fixed left-0 top-0 z-50">
      {/* Logo Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
            <Globe size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold">ManuDocs</h1>
            <p className="text-xs text-gray-400">Export Made Easy</p>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4 overflow-y-auto">
        {menuItems.map((section, sectionIdx) => (
          <div key={sectionIdx} className="mb-6">
            <div className="text-xs font-semibold text-gray-400 mb-3 uppercase tracking-wider">
              {section.section}
            </div>
            <div className="space-y-1">
              {section.items.map((item, itemIdx) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                
                return (
                  <button
                    key={itemIdx}
                    onClick={() => navigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                      isActive
                        ? 'bg-green-500 text-white shadow-lg'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="text-sm">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
            <span className="font-bold text-lg">
              {user?.user_metadata?.full_name?.[0] || user?.email?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">
              {user?.user_metadata?.full_name || 'Exporter'}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {user?.email?.slice(0, 20) || 'user@example.com'}
            </div>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-all"
        >
          <LogOut size={16} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
