'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Grid, List, Hexagon, SlidersHorizontal, BarChart3, PenTool, DollarSign, Zap, BookOpen, Bot, Users, Folder, Activity, Star } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AgentCard from '@/components/AgentCard'
import { generateMockAgents } from '@/lib/utils'

export default function MarketplacePage() {
  const [allAgents, setAllAgents] = useState<any[]>([])
  const [displayedAgents, setDisplayedAgents] = useState<any[]>([])
  const [filteredAgents, setFilteredAgents] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [agentsPerPage] = useState(6)
  const [currentPage, setCurrentPage] = useState(1)

  const categories = ['All', 'Data Analysis', 'Content Creation', 'Trading', 'Automation', 'Research']

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Data Analysis':
        return BarChart3
      case 'Content Creation':
        return PenTool
      case 'Trading':
        return DollarSign
      case 'Automation':
        return Zap
      case 'Research':
        return BookOpen
      default:
        return Hexagon
    }
  }

  useEffect(() => {
    const mockAgents = generateMockAgents(20) // Generate more agents for pagination
    setAllAgents(mockAgents)
    setFilteredAgents(mockAgents)
  }, [])

  useEffect(() => {
    let filtered = allAgents

    if (searchTerm) {
      filtered = filtered.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(agent => agent.category === selectedCategory)
    }

    setFilteredAgents(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, selectedCategory, allAgents])

  useEffect(() => {
    const startIndex = 0
    const endIndex = currentPage * agentsPerPage
    setDisplayedAgents(filteredAgents.slice(startIndex, endIndex))
  }, [filteredAgents, currentPage, agentsPerPage])

  const loadMoreAgents = () => {
    setCurrentPage(prev => prev + 1)
  }

  const hasMoreAgents = displayedAgents.length < filteredAgents.length

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-44 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-text-primary">
              AI Agent <span className="gradient-text">Marketplace</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover, deploy, and earn with the world's most powerful AI agents
            </p>
          </motion.div>

          {/* Search and Filter Bar */}
          <motion.div
            className="card rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <select
                  className="px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                
                <div className="flex items-center space-x-2 border border-border-primary rounded-lg p-1">
                  <button
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-orange-primary text-white' : 'text-text-secondary hover:text-orange-primary'}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid className="w-4 h-4" />
                  </button>
                  <button
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-orange-primary text-white' : 'text-text-secondary hover:text-orange-primary'}`}
                    onClick={() => setViewMode('list')}
                  >
                    <List className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Results Count */}
          <motion.div
            className="flex justify-between items-center mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="text-text-secondary">
              Showing {displayedAgents.length} of {filteredAgents.length} agents
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-text-secondary">Sort by:</span>
              <select className="px-3 py-1 rounded border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary">
                <option>Most Popular</option>
                <option>Highest Rated</option>
                <option>Recently Added</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>
          </motion.div>

          {/* Agents Grid */}
          <motion.div
            className={`grid ${viewMode === 'grid' ? 'md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'} gap-6 mb-12`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {displayedAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={viewMode === 'list' ? 'max-w-none' : ''}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </motion.div>

          {/* Load More Button */}
          {hasMoreAgents && (
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <button 
                onClick={loadMoreAgents}
                className="btn-primary px-8 py-4 rounded-lg font-sans font-semibold hover:bg-orange-700 transition-colors"
              >
                Load More Agents ({filteredAgents.length - displayedAgents.length} remaining)
              </button>
            </motion.div>
          )}

          {/* No Results */}
          {filteredAgents.length === 0 && (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Search className="w-16 h-16 text-text-muted mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-text-primary mb-2">
                No agents found
              </h3>
              <p className="text-text-secondary">
                Try adjusting your search or filters to find what you're looking for.
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl font-bold mb-6 text-text-primary">
              Popular Categories
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Explore agents by category and find the perfect solution for your needs
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.filter(cat => cat !== 'All').map((category, index) => {
              const IconComponent = getCategoryIcon(category)
              return (
                <motion.button
                  key={category}
                  className={`card rounded-xl p-6 text-center transition-colors modern-hover ${
                    selectedCategory === category ? 'bg-orange-50 border-orange-200' : 'hover:bg-orange-50'
                  }`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onClick={() => handleCategorySelect(category)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="w-12 h-12 bg-orange-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                    <IconComponent className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="font-semibold text-text-primary">
                    {category}
                  </div>
                  <div className="text-sm text-text-secondary mt-1">
                    {allAgents.filter(agent => agent.category === category).length} agents
                  </div>
                </motion.button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Agents', value: allAgents.length.toString(), change: 'Live count', icon: Bot },
              { label: 'Categories', value: (categories.length - 1).toString(), change: 'Available now', icon: Folder },
              { label: 'Active Now', value: Math.floor(allAgents.length * 0.8).toString(), change: 'Online agents', icon: Activity },
              { label: 'Avg. Rating', value: '4.8/5', change: 'User rated', icon: Star }
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="card rounded-xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <stat.icon className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
                <div className="text-3xl font-bold text-text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-text-secondary mb-2">
                  {stat.label}
                </div>
                <div className="text-sm text-orange-600">
                  {stat.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary py-12 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-text-muted">
            © 2025 Agentis. Building the future of AI agents.
          </p>
        </div>
      </footer>
    </div>
  )
} 