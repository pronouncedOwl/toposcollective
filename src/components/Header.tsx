'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith('/admin');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header
      className={`left-0 right-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm ${
        isAdminRoute ? 'relative' : 'fixed top-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <Image
                src="/images/topos-logo.png"
                alt="Topos Collective"
                width={300}
                height={75}
                className="h-16 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                About
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/about" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    About
                  </Link>
                  <Link href="/what-we-do" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    What We Do
                  </Link>
                  <Link href="/team" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Team
                  </Link>
                </div>
              </div>
            </div>

            <div className="relative group">
              <button className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
                Projects
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                <div className="py-1">
                  <Link href="/gallery" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Gallery
                  </Link>
                  <Link href="/completed" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Completed
                  </Link>
                  <Link href="/coming-soon" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Coming Soon
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/investors" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Investors
            </Link>
            <Link href="/contact" className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </Link>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-gray-900 focus:outline-none focus:text-gray-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <div className="space-y-1">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 py-2">
                  About
                </div>
                <Link href="/about" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  About
                </Link>
                <Link href="/what-we-do" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  What We Do
                </Link>
                <Link href="/team" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Team
                </Link>
              </div>
              
              <div className="space-y-1">
                <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider px-3 py-2">
                  Projects
                </div>
                <Link href="/gallery" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Gallery
                </Link>
                <Link href="/completed" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Completed
                </Link>
                <Link href="/coming-soon" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Coming Soon
                </Link>
              </div>

              <Link href="/investors" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Investors
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
