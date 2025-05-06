import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/5 py-12 mt-24">
      <div className="halo-container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="text-xl font-bold">
              LegalSathi
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              Connecting you with the best legal professionals for your needs.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Services</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/lawyers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Find Lawyers
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/document-generator"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Document Generator
                </Link>
              </li>
              <li>
                <Link
                  href="/legal-news"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Legal News
                </Link>
              </li>
              <li>
                <Link href="/posts" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Community
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4">Connect</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:harshku612810@gmail.com"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Email
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} LegalSathi. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6">
            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Cookies
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
