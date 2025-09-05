import Link from "next/link";
import { Phone, Mail, MapPin, Clock, Heart } from "lucide-react";

export function Footer() {
  const footerLinks = {
    "Shop": [
      { name: "Karungali Mala", href: "/category/karungali-mala" },
      { name: "Rudraksha Products", href: "/category/rudraksha" },
      { name: "Spiritual Items", href: "/category/spiritual-items" },
      { name: "Certified Products", href: "/category/certified" },
      { name: "Special Offers", href: "/category/offers" },
    ],
    "Customer Service": [
      { name: "Contact Us", href: "/contact" },
      { name: "Shipping Policy", href: "/shipping" },
      { name: "Return Policy", href: "/returns" },
      { name: "FAQ", href: "/faq" },
      { name: "Track Order", href: "/track-order" },
    ],
    "About": [
      { name: "Our Story", href: "/about" },
      { name: "Certification", href: "/certification" },
      { name: "Blog", href: "/blog" },
      { name: "Testimonials", href: "/testimonials" },
    ],
    "Legal": [
      { name: "Privacy Policy", href: "/privacy" },
      { name: "Terms of Service", href: "/terms" },
      { name: "Disclaimer", href: "/disclaimer" },
      { name: "GST Information", href: "/gst-info" },
    ],
  };

  return (
    <footer className="bg-muted text-muted-foreground">
      {/* Newsletter Section */}
      <div className="border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Stay Connected with Spiritual Wisdom
            </h3>
            <p className="mb-6">
              Subscribe to receive updates on new spiritual products, exclusive offers, and ancient wisdom insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">स</span>
              </div>
              <span className="font-bold text-xl text-foreground">Spiritual Store</span>
            </div>
            <p className="mb-4 text-sm">
              Discover authentic spiritual products crafted with devotion. 
              From sacred Karungali mala to certified Rudraksha, each item carries 
              the essence of ancient wisdom for modern spiritual seekers.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>support@spiritualstore.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Mon-Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2 text-sm">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-center md:text-left">
              © 2024 Spiritual Store. All rights reserved. | 
              Made with <Heart className="inline h-4 w-4 text-destructive" /> for spiritual seekers
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Secure Payments</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Authentic Products</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-green-600">✓</span>
                <span>Pan India Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}