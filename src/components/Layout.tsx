import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Ticket } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <div className="flex items-center gap-2 mb-8">
          <Ticket className="w-8 h-8" />
          <h1 className="text-xl font-bold">Support System</h1>
        </div>
        
        <nav className="space-y-4">
          <button
            onClick={() => navigate('/tickets')}
            className="flex items-center gap-2 w-full px-4 py-2 rounded hover:bg-gray-700"
          >
            <Ticket className="w-5 h-5" />
            Tickets
          </button>
          
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-4 py-2 rounded hover:bg-gray-700"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
        
        <div className="absolute bottom-6 left-6">
          <p className="text-sm text-gray-400">Logged in as:</p>
          <p className="text-sm">{user?.email}</p>
          <p className="text-sm text-gray-400">{user?.role}</p>
        </div>
      </aside>
      
      <main className="flex-1 overflow-auto bg-gray-100">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
};