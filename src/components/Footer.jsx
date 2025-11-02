import { Link } from "react-router-dom";
import { Github, Facebook, Twitter, Dribbble, Instagram } from "lucide-react";
import logo from "../assets/logo.png";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        
        {/* Logo + About */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Zyra" className="h-5 w-auto" />
          </div>
          <p className="text-sm text-gray-600">
            Fashion that defines you — explore curated styles for Women, Men, and Kids.
          </p>
        </div>

        {/* Community */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
            Community
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/about" className="hover:text-black">About</Link></li>
            <li><a href="#" className="hover:text-black">Submit an Issue</a></li>
            <li><a href="https://github.com" target="_blank" className="hover:text-black">GitHub Repo</a></li>
            <li><a href="#" className="hover:text-black">Slack</a></li>
          </ul>
        </div>

        {/* Getting Started */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
            Getting Started
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/" className="hover:text-black">Introduction</Link></li>
            <li><Link to="/products" className="hover:text-black">Browse Products</Link></li>
            <li><Link to="/register" className="hover:text-black">Create Account</Link></li>
            <li><Link to="/login" className="hover:text-black">Login</Link></li>
            <li><Link to="/cart" className="hover:text-black">Your Cart</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-3 uppercase text-sm tracking-wide">
            Resources
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><Link to="/faq" className="hover:text-black">FAQ</Link></li>
            <li><Link to="/contact" className="hover:text-black">Contact</Link></li>
            <li><a href="#" className="hover:text-black">Accessibility</a></li>
            <li><a href="#" className="hover:text-black">Marketplace</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Zyra. All rights reserved.</p>

          <div className="flex items-center gap-6 mt-4 md:mt-0">
            <Link to="/terms" className="hover:text-black">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-black">Privacy Policy</Link>
            <Link to="/security" className="hover:text-black">Security</Link>
            <Link to="/sitemap" className="hover:text-black">Sitemap</Link>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-5 mt-4 md:mt-0 text-gray-700">
            <a href="#" className="hover:text-black"><Twitter size={18} /></a>
            <a href="#" className="hover:text-black"><Github size={18} /></a>
            <a href="#" className="hover:text-black"><Facebook size={18} /></a>
            <a href="#" className="hover:text-black"><Dribbble size={18} /></a>
            <a href="#" className="hover:text-black"><Instagram size={18} /></a>


          </div>
        </div>
      </div>
    </footer>
  );
}
