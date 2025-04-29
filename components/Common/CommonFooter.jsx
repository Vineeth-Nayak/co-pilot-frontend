import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaRegNewspaper, FaUserEdit, FaTags } from "react-icons/fa";

export default function CommonFooter() {
  return (
    <footer className="bg-gray-800 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <span className="bg-blue-600 text-white p-2 rounded-lg mr-2">
                <FaRegNewspaper />
              </span>
              Vineeth News App
            </h3>
            <p className="text-gray-400 text-sm">Empowering content creators with a modern, intuitive publishing platform.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <span className="w-5 mr-2">
                    <FaRegNewspaper />
                  </span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xl font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/documentation" className="text-gray-400 hover:text-white transition-colors">
                  Documentation
                </Link>
              </li>
              <li>
                <Link href="/support" className="text-gray-400 hover:text-white transition-colors">
                  Support Center
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/changelog" className="text-gray-400 hover:text-white transition-colors">
                  Changelog
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <p className="text-gray-400 text-sm mb-4">Follow us on social media for updates and news.</p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Facebook"
              >
                <FaFacebookF className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Twitter"
              >
                <FaTwitter className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="Instagram"
              >
                <FaInstagram className="h-5 w-5" />
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-gray-700"
                aria-label="LinkedIn"
              >
                <FaLinkedinIn className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-700 pt-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-sm text-gray-400 mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Vineeth News App. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-sm text-gray-400 hover:text-white transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
