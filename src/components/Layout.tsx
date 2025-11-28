import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { LogOut, Home, Users, LayoutDashboard, Heart, FileCheck, PieChart, Users2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Layout() {
  const { user, signOut, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <nav className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center space-x-4">
                <Link
                  to="/"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Home className="h-5 w-5 mr-1" />
                  Home
                </Link>
                <Link
                  to="/dashboard"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <LayoutDashboard className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/cooperative"
                    className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                  >
                    <Users className="h-5 w-5 mr-1" />
                    Cooperative
                  </Link>
                )}
                <Link
                  to="/csr"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Heart className="h-5 w-5 mr-1" />
                  CSR
                </Link>
                <Link
                  to="/compliance"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <FileCheck className="h-5 w-5 mr-1" />
                  Compliance
                </Link>
                <Link
                  to="/analytics"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <PieChart className="h-5 w-5 mr-1" />
                  Analytics
                </Link>
                <Link
                  to="/member-area"
                  className="flex items-center px-2 py-2 text-gray-600 hover:text-gray-900"
                >
                  <Users2 className="h-5 w-5 mr-1" />
                  Members
                </Link>
              </div>
              <div className="flex items-center">
                <button
                  onClick={handleSignOut}
                  className="flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 hover:text-gray-700 focus:outline-none transition"
                >
                  <LogOut className="h-5 w-5 mr-1" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </nav>
      ) : null}
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}