import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Package } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-secondary-900 border-t border-secondary-200 dark:border-secondary-800 transition-colors pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">

          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <span className="bg-gradient-to-r from-primary-500 to-primary-600 dark:from-primary-400 dark:to-primary-500 p-2 rounded-xl text-white shadow-md">
                <img src="https://ik.imagekit.io/stringstackseema/handmade%20jewelry/logo.png" alt="CraftNest Logo" className="w-5 h-5 object-contain" />
              </span>
              <span className="font-outfit font-extrabold text-xl tracking-tight text-secondary-900 dark:text-white">
                Craft<span className="text-primary-500">Nest</span>
              </span>
            </Link>

            <p className="text-sm text-secondary-500 dark:text-secondary-400 leading-relaxed">
              Discover unique, beautifully handcrafted products created by independent local artisans.
            </p>

            <div className="flex items-center gap-3">
              <a
                href="#"
                className="p-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:text-primary-500 transition-colors"
              >
                <FaFacebookF className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="p-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:text-primary-500 transition-colors"
              >
                <FaInstagram className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="p-2 rounded-xl bg-secondary-100 dark:bg-secondary-800 text-secondary-600 dark:text-secondary-300 hover:text-primary-500 transition-colors"
              >
                <FaTwitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-outfit font-semibold text-sm text-secondary-900 dark:text-white mb-4 uppercase tracking-wider">
              Explore
            </h3>

            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/categories" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Categories
                </Link>
              </li>

              <li>
                <Link to="/products" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Products
                </Link>
              </li>

              <li>
                <Link to="/about" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-outfit font-semibold text-sm text-secondary-900 dark:text-white mb-4 uppercase tracking-wider">
              Information
            </h3>

            <ul className="space-y-2">
              <li>
                <Link to="/contact" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Contact Us
                </Link>
              </li>

              <li>
                <a href="#" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Privacy Policy
                </a>
              </li>

              <li>
                <a href="#" className="text-sm text-secondary-500 dark:text-secondary-400 hover:text-primary-500 transition-colors">
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-outfit font-semibold text-sm text-secondary-900 dark:text-white mb-4 uppercase tracking-wider">
              Contact Info
            </h3>

            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                <MapPin className="w-4 h-4 text-primary-500 shrink-0" />
                <span>123 Crafts Lane, Jaipur, Rajasthan, India</span>
              </li>

              <li className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                <Phone className="w-4 h-4 text-primary-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>

              <li className="flex items-center gap-3 text-sm text-secondary-500 dark:text-secondary-400">
                <Mail className="w-4 h-4 text-primary-500 shrink-0" />
                <span>support@craftnest.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="border-t border-secondary-200 dark:border-secondary-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-400">
          <p>© {new Date().getFullYear()} CraftNest. All rights reserved.</p>

          <div className="flex gap-4 mt-4 sm:mt-0">
            <a href="#" className="hover:text-primary-500">
              Security
            </a>

            <a href="#" className="hover:text-primary-500">
              Sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;