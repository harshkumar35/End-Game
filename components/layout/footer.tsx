import Link from "next/link"
import { Star } from "lucide-react"

export function Footer() {
  return (
    <footer className="relative border-t border-blue-900/30 py-16 mt-24 overflow-hidden">
      {/* Cosmic background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full filter blur-[80px]"></div>
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full filter blur-[100px]"></div>

        {/* Stars */}
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className={`absolute star ${i % 3 === 0 ? "star-small" : i % 3 === 1 ? "star-medium" : "star-large"}`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="halo-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold group flex items-center">
              <Star className="mr-2 h-5 w-5 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="bg-gradient-to-r from-white to-blue-300 bg-clip-text text-transparent">LegalSathi</span>
            </Link>
            <p className="mt-4 text-blue-300/70 text-sm">
              Connecting you with the best legal professionals for your needs in a universe of legal expertise.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-blue-300">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/lawyers"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/document-generator"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Document Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-news"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Legal News
                </Link>
              </li>
              <li>
                <Link
                  href="/posts"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-blue-300">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 text-blue-300">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:harshku612810@gmail.com"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-300/70 hover:text-blue-300 transition-colors flex items-center group"
                >
                  <span className="w-1 h-1 bg-blue-400 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-blue-900/30 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-blue-300/50">&copy; {new Date().getFullYear()} LegalSathi. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-xs text-blue-300/50 hover:text-blue-300 transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-blue-300/50 hover:text-blue-300 transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-blue-300/50 hover:text-blue-300 transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
