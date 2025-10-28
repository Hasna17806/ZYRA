import { Instagram, Facebook, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20">
      {/* Footer Top: Links + Social */}
      <div className="bg-[#1a1a1a] text-gray-400 text-sm py-10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center px-6 gap-6">
          {/* Left - Brand Links */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 text-center sm:text-left">
             <div className="text-white font-bold text-lg">ZYRA</div>
            <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <a href="#" className="hover:text-white transition-colors">
              About
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Contact
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            </div>
          </div>

          {/* Right - Social Icons */}
          <div className="flex justify-center sm:justify-end gap-5">
            <a href="#" aria-label="Instagram" className="hover:text-white transition-colors">
              <Instagram className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Facebook" className="hover:text-white transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom: Copyright */}
      <div className="bg-[#111111] text-gray-500 text-xs py-5 text-center">
        <p>
          © {new Date().getFullYear()} ZYRA. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
