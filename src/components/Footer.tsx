import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaTwitter, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">BMMSWC</h3>
            <p className="text-white/80 max-w-sm">
              Bangladesh Manipuri Muslim Student Welfare Community. Working for the educational and social welfare of the community.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-white/80 hover:text-secondary transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/committee" className="text-white/80 hover:text-secondary transition-colors">
                  Current Committee
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-white/80 hover:text-secondary transition-colors">
                  News & Events
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-secondary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-white/80">
                <MapPin className="w-5 h-5 mt-0.5 text-secondary" />
                <span>AdampurBazar, Moulvibazar</span>
              </li>
              <li className="flex items-center space-x-3 text-white/80">
                <Phone className="w-5 h-5 text-secondary" />
                <span>+880 1942357476</span>
              </li>
              <li className="flex items-center space-x-3 text-white/80">
                <Mail className="w-5 h-5 text-secondary" />
                <span>contact@bmmswc.org</span>
              </li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <Link href="https://www.facebook.com/BMMCKP" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors text-white">
                <FaFacebook className="w-5 h-5" />
              </Link>
              <Link href="#" className="p-2 bg-white/10 rounded-full hover:bg-secondary transition-colors text-white">
                <FaTwitter className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
        <div className="border-t border-white/20 mt-8 pt-8 text-center text-white/60">
          <p>&copy; {new Date().getFullYear()} BMMSWC. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
