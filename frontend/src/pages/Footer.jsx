import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black text-center py-6 border-t border-gray-300">
      {/* Top links */}
      <div className="flex justify-center space-x-4 mb-2">
        <Link to="#" className="hover:underline font-semibold">About Us</Link>
        <span>|</span>
        <Link to="#" className="hover:underline font-semibold">How It Works</Link>
        <span>|</span>
        <Link to="#" className="hover:underline font-semibold">Why Us</Link>
        <span>|</span>
        <Link to="#" className="hover:underline font-semibold">Feedbacks</Link>
      </div>

      {/* Contact info */}
      <div className="flex justify-center items-center gap-3 text-sm mb-3">
        <span className="text-blue-700">📧</span>
        <a href="mailto:info@triconnect.com" className="text-blue-700 hover:underline">
          info@triconnect.com
        </a>
        <span className="text-blue-700 ml-4">📞</span>
        <a href="tel:+639123456789" className="text-blue-700 hover:underline">
          +639123456789
        </a>
      </div>

      {/* Divider */}
      <div className="border-2 border-black w-[90%] mx-auto mb-3"></div>

      {/* Copyright */}
      <p className="text-sm">
        Copyright © 2025{" "}
        <span className="text-blue-700 font-semibold">TriConnect</span> All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;
