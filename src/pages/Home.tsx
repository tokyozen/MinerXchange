import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Building2, Users, BarChart2, ShoppingBag, Globe, Heart, FileCheck, PieChart, Users2 } from 'lucide-react';

export default function Home() {
  const { user } = useAuth();

  if (user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to Miner Exchange</h1>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            to="/dashboard"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <BarChart2 className="h-8 w-8 text-indigo-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Your Dashboard</h3>
            <p className="mt-2 text-sm text-gray-500">
              View your listings and manage your mineral submissions
            </p>
          </Link>

          <Link
            to="/marketplace"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <ShoppingBag className="h-8 w-8 text-green-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Marketplace</h3>
            <p className="mt-2 text-sm text-gray-500">
              Browse and purchase mining resources from verified sellers
            </p>
          </Link>

          <Link
            to="/csr"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart className="h-8 w-8 text-red-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">CSR Initiatives</h3>
            <p className="mt-2 text-sm text-gray-500">
              Track and manage CSR initiatives, including community development projects, progress updates, and proof of work uploads
            </p>
          </Link>

          <Link
            to="/compliance"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <FileCheck className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Compliance & Permits</h3>
            <p className="mt-2 text-sm text-gray-500">
              Apply for mining permits, track compliance status, and receive automated alerts for renewals and audits
            </p>
          </Link>

          <Link
            to="/analytics"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <PieChart className="h-8 w-8 text-purple-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Analytics & Reporting</h3>
            <p className="mt-2 text-sm text-gray-500">
              View insights on mineral submissions, transaction stats, earnings, and compliance status in real-time
            </p>
          </Link>

          <Link
            to="/member-area"
            className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <Users2 className="h-8 w-8 text-orange-600 mb-3" />
            <h3 className="text-lg font-medium text-gray-900">Member Area</h3>
            <p className="mt-2 text-sm text-gray-500">
              Manage your members, track submissions, and view aggregated totals for cooperatives
            </p>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <img 
            src="https://res.cloudinary.com/dyas8qe3h/image/upload/v1734950125/Miner_LOGO_tfptqo.webp"
            alt="Miner Exchange Logo"
            className="h-24 w-auto mx-auto mb-6"
          />
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            Welcome to Miner Exchange
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            The premier platform for mining cooperatives to manage resources and connect with global markets
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
              <Globe className="h-8 w-8 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Network</h3>
              <p className="text-gray-600">Connect with verified buyers and sellers worldwide</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
              <Building2 className="h-8 w-8 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Cooperative Management</h3>
              <p className="text-gray-600">Efficiently manage your mining cooperative</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md transform hover:scale-105 transition-transform">
              <Users className="h-8 w-8 text-purple-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Member Support</h3>
              <p className="text-gray-600">Comprehensive tools for cooperative members</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm transition-colors duration-200 transform hover:scale-105"
            >
              Sign In
            </Link>
            <span className="text-gray-500">or</span>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-3 text-base font-medium text-indigo-600 bg-white hover:bg-indigo-50 rounded-md shadow-sm border border-indigo-300 transition-colors duration-200 transform hover:scale-105"
            >
              Register Your Cooperative
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}