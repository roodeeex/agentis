'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

// Global variable to track if navbar has been animated
let hasNavbarAnimated = false

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(hasNavbarAnimated)
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    // Only animate once per session
    if (!hasNavbarAnimated) {
      setHasAnimated(false)
      hasNavbarAnimated = true
    }
  }, [])

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Marketplace', href: '/marketplace' },
    { name: 'Forge', href: '/forge' },
  ]

  const isActive = (href: string) => pathname === href

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-7xl px-4">
      <motion.nav
        className="bg-white/80 backdrop-blur-lg border border-border-primary rounded-full shadow-lg px-6 py-4"
        initial={hasAnimated ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: hasAnimated ? 0 : 0.6 }}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-text-primary">
              Agentis
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-orange-600'
                    : 'text-text-secondary hover:text-orange-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            <motion.button
              className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors"
              onClick={() => router.push('/forge')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-orange-600 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div
            className="md:hidden mt-4 pt-4 border-t border-border-primary"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-orange-600'
                      : 'text-text-secondary hover:text-orange-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <motion.button
                className="bg-orange-600 text-white px-6 py-2 rounded-full font-medium hover:bg-orange-700 transition-colors w-full"
                onClick={() => {
                  router.push('/forge')
                  setIsMenuOpen(false)
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </motion.nav>
    </div>
  )
} 