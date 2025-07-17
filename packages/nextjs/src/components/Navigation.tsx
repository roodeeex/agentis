'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, Menu, X, Wallet, ChevronDown, ShoppingCart, Briefcase } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useWeb3 } from '@/lib/hooks/useWeb3'

// Global variable to track if navbar has been animated
let hasNavbarAnimated = false

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hasAnimated, setHasAnimated] = useState(hasNavbarAnimated)
  const pathname = usePathname()
  const { isConnected, address, connect, disconnect, isLoading, error } = useWeb3()

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

  const userMenuItems = [
    { name: 'My Orders', href: '/my-orders', icon: ShoppingCart },
    { name: 'My Creations', href: '/my-creations', icon: Briefcase },
  ]

  const isActive = (href: string) => pathname === href

  const handleConnectWallet = async () => {
    try {
      await connect()
    } catch (error) {
      console.error('Failed to connect wallet:', error)
    }
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

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
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
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
                    ? 'text-purple-600'
                    : 'text-text-secondary hover:text-purple-600'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center">
            {isConnected && address ? (
              <div className="relative group">
                <div className="flex items-center space-x-2 cursor-pointer bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium">
                  <span>{formatAddress(address)}</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
                <motion.div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg py-1 z-10 origin-top-right
                             invisible opacity-0 group-hover:visible group-hover:opacity-100 transition-all duration-200"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                >
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <item.icon className="w-4 h-4 mr-2" />
                      {item.name}
                    </Link>
                  ))}
                  <div className="border-t border-gray-100 my-1"></div>
                <button
                  onClick={disconnect}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                >
                  Disconnect
                </button>
                </motion.div>
              </div>
            ) : (
              <motion.button
                className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
                onClick={handleConnectWallet}
                disabled={isLoading}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Wallet className="w-4 h-4" />
                <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
              </motion.button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-text-secondary hover:text-purple-600 transition-colors"
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
                      ? 'text-purple-600'
                      : 'text-text-secondary hover:text-purple-600'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              {isConnected && address ? (
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex items-center justify-between mb-2">
                  <span className="bg-green-100 text-green-800 px-3 py-2 rounded-full text-sm font-medium text-center">
                    {formatAddress(address)}
                  </span>
                  <button
                    onClick={() => {
                        disconnect();
                        setIsMenuOpen(false);
                    }}
                      className="text-sm text-red-600"
                  >
                    Disconnect
                  </button>
                  </div>
                  {userMenuItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center py-2 text-text-secondary hover:text-purple-600"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <motion.button
                  className="bg-purple-600 text-white px-6 py-2 rounded-full font-medium hover:bg-purple-700 transition-colors w-full flex items-center justify-center space-x-2 disabled:opacity-50"
                  onClick={() => {
                    handleConnectWallet()
                    setIsMenuOpen(false)
                  }}
                  disabled={isLoading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Wallet className="w-4 h-4" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </motion.button>
              )}
            </div>
          </motion.div>
        )}

        {/* Error message */}
        {error && (
          <div className="mt-2 text-red-600 text-sm text-center">
            {error}
          </div>
        )}
      </motion.nav>
    </div>
  )
} 