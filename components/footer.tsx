import React from "react";
import Link from "next/link";
import {
  Package,
  Users,
  GraduationCap,
  Truck,
  Mail,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Shield,
  FileText,
} from "lucide-react";

// Usage example in your LandingPage component:
// import Footer from './Footer';
//
// Then add <Footer /> at the bottom of your LandingPage component

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Links",
      links: [
        { name: "About", href: "/about", icon: FileText },
        { name: "LearnX Blog", href: "/learn", icon: GraduationCap },
        { name: "Buyer Policy", href: "/buyer-policy", icon: FileText },
        { name: "Supplier Policy", href: "/supplier-policy", icon: FileText },
        { name: "Contact", href: "mailto:support@openxmart.com", icon: Mail },
      ],
    },
    {
      title: "Account & Legal",
      links: [
        { name: "Login", href: "/login", icon: Users },
        { name: "Privacy Policy", href: "/privacy-policy", icon: Shield },
        {
          name: "Terms of Service",
          href: "/terms-and-conditions",
          icon: FileText,
        },
        { name: "Refund Policy", href: "/refund-policy", icon: FileText },
        { name: "Shipping Policy", href: "/shipping-policy", icon: Truck },
      ],
    },
  ];

  const socialLinks = [
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
    { name: "YouTube", href: "https://youtube.com", icon: Youtube },
    { name: "Threads", href: "https://www.threads.net", icon: Instagram },
    { name: "X (Twitter)", href: "https://twitter.com", icon: Twitter },
  ];

  const quickLinks: { name: string; href: string }[] = [];

  return (
    <footer className="bg-gray-900 text-white mt-24 lg:mt-48">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      <span className="text-sm hover:underline">
                        {link.name}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {/* Social Column */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Social
            </h3>
            <div className="flex items-center gap-3 pt-1">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                  aria-label={`Follow us on ${social.name}`}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="max-w-3xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Get Weekly Winning Products
            </h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Enter Email/WhatsApp"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Quick Links removed as per updated footer content */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} OpenXmart Technologies. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <Link
                  href="/privacy-policy"
                  className="hover:text-gray-300 transition-colors"
                >
                  Privacy
                </Link>
                <span>•</span>
                <Link
                  href="/terms-and-conditions"
                  className="hover:text-gray-300 transition-colors"
                >
                  Terms
                </Link>
                <span>•</span>
                <Link
                  href="/refund-policy"
                  className="hover:text-gray-300 transition-colors"
                >
                  Refunds
                </Link>
                <span>•</span>
                <Link
                  href="/shipping-policy"
                  className="hover:text-gray-300 transition-colors"
                >
                  Shipping
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4" />
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Package className="w-4 h-4" />
                <span>Trusted by 10K+ Suppliers</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
