"use client";

import React from "react";
import {
  ArrowRight,
  Shield,
  Users,
  Zap,
  CheckCircle,
  Star,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface PageProps {
  isLoggedIn: boolean;
}

const LandingPage = ({ isLoggedIn }: PageProps) => {
  const router = useRouter();
  console.log("isLoggedIn:", isLoggedIn);
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 tracking-tight">
              The Future of
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                {" "}
                B2B Sampling
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Connect with trusted suppliers, order samples seamlessly, and
              scale your business with confidence. OpenXMart makes B2B sampling
              simple, secure, and efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => {
                  if (isLoggedIn) {
                    router.push("/supplier");
                  } else {
                    router.push("/login");
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Start Sampling Today
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:bg-gray-50">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose OpenXMart?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the power of seamless B2B sampling with our
              industry-leading platform
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Secure & Trusted
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Enterprise-grade security with verified suppliers and encrypted
                transactions. Your business data is always protected.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Streamlined ordering process that reduces sample procurement
                time by 70%. Get samples in your hands faster.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Global Network
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Access thousands of verified suppliers worldwide. Find the
                perfect products for your business needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How OpenXMart Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, efficient, and designed for modern businesses
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                1
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Browse & Discover
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Explore our curated marketplace of verified suppliers and
                high-quality products across multiple industries.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                2
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Order Samples
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Request samples with just a few clicks. Our streamlined process
                ensures quick turnaround times.
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-2xl font-bold">
                3
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Scale Your Business
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Make informed decisions with quality samples and build lasting
                partnerships with trusted suppliers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
                Built for Modern Businesses
              </h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Quality Assurance
                    </h3>
                    <p className="text-gray-600">
                      Every supplier is thoroughly vetted and verified for
                      quality and reliability.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Real-time Tracking
                    </h3>
                    <p className="text-gray-600">
                      Monitor your sample orders from request to delivery with
                      live updates.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Dedicated Support
                    </h3>
                    <p className="text-gray-600">
                      24/7 customer support to help you every step of the way.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl p-8 text-white">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 mx-auto mb-6" />
                <h3 className="text-3xl font-bold mb-4">
                  Join 10,000+ Businesses
                </h3>
                <p className="text-xl opacity-90 mb-6">
                  Companies worldwide trust OpenXMart for their B2B sampling
                  needs
                </p>
                <div className="flex justify-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-6 h-6 fill-current text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-lg opacity-90">4.9/5 average rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Sampling Process?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses already using OpenXMart to streamline
            their B2B sampling workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              Get Started Free
              <ArrowRight className="w-5 h-5" />
            </button>
            <button className="border-2 border-white hover:bg-white hover:text-blue-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">OpenXMart</h3>
              <p className="text-gray-400">
                The future of B2B sampling. Secure, trusted, and efficient.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 OpenXMart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
