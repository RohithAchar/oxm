import React from "react";
import Link from "next/link";
import {
  Package,
  Users,
  GraduationCap,
  Truck,
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Shield,
  FileText,
  HelpCircle,
  Building2,
} from "lucide-react";

// Usage example in your LandingPage component:
// import Footer from './Footer';
//
// Then add <Footer /> at the bottom of your LandingPage component

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: "Products & Services",
      links: [
        { name: "Explore Products", href: "/products", icon: Package },
        // { name: "Product Categories", href: "/category", icon: Package },
        { name: "New Launches", href: "/products?filter=new", icon: Package },
        // { name: "Dropshipping", href: "/dropship", icon: Truck },
        // { name: "Bulk Orders", href: "/products?type=bulk", icon: Package },
      ],
    },
    {
      title: "For Suppliers",
      links: [
        { name: "Supplier Dashboard", href: "/supplier", icon: Building2 },
        { name: "Add Products", href: "/supplier/add-product", icon: Package },
        {
          name: "Manage Products",
          href: "/supplier/manage-products",
          icon: Package,
        },
        { name: "View Profile", href: "/supplier/view-profile", icon: Users },
        { name: "Trust Score", href: "/supplier/trust-score", icon: Shield },
        { name: "Supplier Tips", href: "/supplier/tips", icon: GraduationCap },
      ],
    },
    {
      title: "Business Solutions",
      links: [
        { name: "Create Business", href: "/create-business", icon: Building2 },
        // {
        //   name: "Verify Business",
        //   href: "/admin/verify-business",
        //   icon: Shield,
        // },
        { name: "My Box", href: "/supplier", icon: Users },
        { name: "Orders Management", href: "/supplier/orders", icon: Package },
        { name: "Business Enquiries", href: "/supplier/enquiry", icon: Mail },
      ],
    },
    {
      title: "Learning & Support",
      links: [
        { name: "Learn X", href: "/learn", icon: GraduationCap },
        { name: "Help Center", href: "/help", icon: HelpCircle },
        { name: "Contact Support", href: "/contact", icon: Mail },
        { name: "Business Tips", href: "/supplier/tips", icon: GraduationCap },
        { name: "Documentation", href: "/docs", icon: FileText },
      ],
    },
    {
      title: "Account & Legal",
      links: [
        { name: "Login", href: "/login", icon: Users },
        // { name: "Dashboard", href: "/dashboard", icon: Users },
        { name: "Privacy Policy", href: "/privacy", icon: Shield },
        { name: "Terms of Service", href: "/terms", icon: FileText },
        { name: "Refund Policy", href: "/refund-policy", icon: FileText },
        { name: "Shipping Policy", href: "/shipping-policy", icon: Truck },
      ],
    },
  ];

  const socialLinks = [
    { name: "Facebook", href: "https://facebook.com", icon: Facebook },
    { name: "Twitter", href: "https://twitter.com", icon: Twitter },
    { name: "Instagram", href: "https://instagram.com", icon: Instagram },
    { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
  ];

  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Careers", href: "/careers" },
    { name: "Press", href: "/press" },
    { name: "Blog", href: "/blog" },
    { name: "Sitemap", href: "/sitemap" },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
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
        </div>

        {/* Newsletter Signup */}
        <div className="mt-16 pt-8 border-t border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Stay Updated
              </h3>
              <p className="text-gray-300 mb-6">
                Get the latest product updates, exclusive deals, and business
                tips delivered to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 whitespace-nowrap">
                  Subscribe Now
                </button>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white mb-4">
                Get In Touch
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 text-gray-300">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span>support@yourplatform.com</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <Phone className="w-5 h-5 text-green-400" />
                  <span>+91 12345 67890</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-300">
                  <MapPin className="w-5 h-5 text-red-400" />
                  <span>Bengaluru, Karnataka, India</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4">
                <h4 className="text-sm font-semibold text-white mb-3">
                  Follow Us
                </h4>
                <div className="flex space-x-4">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-700 transition-all duration-200"
                      aria-label={`Follow us on ${social.name}`}
                    >
                      <social.icon className="w-5 h-5" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {quickLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-gray-300 hover:text-white text-sm transition-colors duration-200 hover:underline"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 md:px-12 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © {currentYear} Your Platform Name. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <Link
                  href="/privacy"
                  className="hover:text-gray-300 transition-colors"
                >
                  Privacy
                </Link>
                <span>•</span>
                <Link
                  href="/terms"
                  className="hover:text-gray-300 transition-colors"
                >
                  Terms
                </Link>
                <span>•</span>
                <Link
                  href="/cookies"
                  className="hover:text-gray-300 transition-colors"
                >
                  Cookies
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
