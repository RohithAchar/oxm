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
import { H3 } from "@/components/ui/h3";
import { P } from "@/components/ui/p";

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <H3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                {section.title}
              </H3>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-200 group"
                    >
                      <link.icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                      <span
                        className={`text-sm hover:underline ${
                          link.name.toLowerCase().includes("policy") ||
                          link.name.toLowerCase().includes("terms")
                            ? "text-gray-400/80 group-hover:text-white"
                            : "text-gray-200"
                        }`}
                      >
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
            <H3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
              Social
            </H3>
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
        {/* Quick Links removed as per updated footer content */}
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <P className="text-gray-400 text-sm">
                © {currentYear} OpenXmart Technologies. All rights reserved.
              </P>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <Link
                  href="/privacy-policy"
                  className="text-gray-500/80 hover:text-gray-300 transition-colors"
                >
                  Privacy
                </Link>
                <span>•</span>
                <Link
                  href="/terms-and-conditions"
                  className="text-gray-500/80 hover:text-gray-300 transition-colors"
                >
                  Terms
                </Link>
                <span>•</span>
                <Link
                  href="/refund-policy"
                  className="text-gray-500/80 hover:text-gray-300 transition-colors"
                >
                  Refunds
                </Link>
                <span>•</span>
                <Link
                  href="/shipping-policy"
                  className="text-gray-500/80 hover:text-gray-300 transition-colors"
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
