import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Heart,
  ExternalLink,
  ArrowUp,
  Globe,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";
import Avatar from "./Avatar";

const Footer = () => {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic
    setEmail("");
    // Show success message or notification
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-b from-white to-gray-50">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-1 lg:col-span-1">
            <Link
              to="/"
              className="flex items-center gap-3 group mb-6">
              <div className="relative">
                <Avatar
                  url="./logo.png"
                  size="sm"
                  className="ring-2 ring-indigo-500/20 shadow-md"
                />
              </div>
              <div>
                <h2 className="text-lg font-black tracking-tight flex items-center">
                  <motion.span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500"
                    animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                    transition={{ duration: 5, repeat: Infinity }}>
                    Free
                  </motion.span>
                  <span className="text-gray-900">Pal</span>
                </h2>
                <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-medium -mt-1">
                  Connect & Share
                </p>
              </div>
            </Link>

            <p className="text-gray-600 mb-6 text-sm leading-relaxed">
              FreePal connects you with the people who matter most. Share
              stories, join communities, and build meaningful connections in a
              safe, supportive environment designed for real human connection.
            </p>

            <div className="flex space-x-4 mb-8">
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <Twitter size={16} />
              </motion.a>
              <motion.a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <Facebook size={16} />
              </motion.a>
              <motion.a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <Instagram size={16} />
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <Linkedin size={16} />
              </motion.a>
              <motion.a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-indigo-600 transition-colors p-2 bg-white rounded-full shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}>
                <Youtube size={16} />
              </motion.a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Globe
                size={16}
                className="text-indigo-500"
              />
              Company
            </h3>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Careers", href: "/careers" },
                { label: "Press", href: "/press" },
                { label: "News", href: "/news" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-1 group">
                    <span>{link.label}</span>
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <HelpCircle
                size={16}
                className="text-indigo-500"
              />
              Resources
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Help Center", href: "/help" },
                { label: "Community Guidelines", href: "/guidelines" },
                { label: "Safety Center", href: "/safety" },
                { label: "Blog", href: "/blog" },
                { label: "Developers", href: "/developers" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-1 group">
                    <span>{link.label}</span>
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>

            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5 mt-8 flex items-center gap-2">
              <Shield
                size={16}
                className="text-indigo-500"
              />
              Legal
            </h3>
            <ul className="space-y-3">
              {[
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Cookie Policy", href: "/cookies" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-gray-500 hover:text-indigo-600 text-sm transition-colors flex items-center gap-1 group">
                    <span>{link.label}</span>
                    <ExternalLink
                      size={12}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
              <Mail
                size={16}
                className="text-indigo-500"
              />
              Stay Updated
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter for updates, news, and exclusive
              content tailored to your interests.
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mb-3">
              <div className="flex flex-col gap-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail
                      size={16}
                      className="text-gray-400"
                    />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 pr-3 py-2 w-full bg-white border border-gray-200 rounded-lg text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
                  />
                </div>
                <motion.button
                  type="submit"
                  className="inline-flex w-fit items-center gap-2 px-6 py-3 text-white font-medium bg-gradient-to-r from-indigo-500 to-pink-500 rounded-xl
                           hover:shadow-lg hover:shadow-indigo-500/25 transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  Subscribe
                </motion.button>
              </div>
            </form>
            <p className="text-xs text-gray-500">
              By subscribing, you agree to our Privacy Policy and consent to
              receive updates.
            </p>


          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between">
          <div className="flex flex-col sm:flex-row items-center gap-2 text-xs text-gray-500">
            <span>© {currentYear} FreePal. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <Link
              to="/privacy"
              className="hover:text-indigo-600 transition-colors">
              Privacy
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              to="/terms"
              className="hover:text-indigo-600 transition-colors">
              Terms
            </Link>
            <span className="hidden sm:inline">•</span>
            <Link
              to="/cookies"
              className="hover:text-indigo-600 transition-colors">
              Cookies
            </Link>
          </div>

          <div className="flex items-center mt-4 sm:mt-0 gap-3">
            <motion.button
              onClick={scrollToTop}
              className="inline-flex items-center justify-center p-2 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 transition-colors shadow-sm"
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Back to top">
              <ArrowUp size={16} />
            </motion.button>
            <span className="text-xs text-gray-400">
              Made with{" "}
              <Heart
                size={12}
                className="inline text-pink-500"
              />{" "}
              by FreePal Team
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
