import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';
import { useAuth } from '../context/AuthContext';

const Layout = () => {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const showChatbot = !location.pathname.startsWith('/admin') && !isAdmin;

  return (
    <div className="min-h-screen flex flex-col bg-secondary-50 dark:bg-secondary-950 transition-colors duration-300">
      <Navbar />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-secondary-900 dark:text-white transition-colors duration-300">
        <Outlet />
      </main>
      <Footer />
      {showChatbot && <ChatbotWidget />}
    </div>
  );
};

export default Layout;
