'use client'

import { motion } from 'framer-motion'
import { Search, Filter, TrendingUp, Users, DollarSign, Star } from 'lucide-react'
import { useState, useMemo } from 'react'
import AgentCard from '@/components/AgentCard'
import { useAgents } from '@/lib/hooks/useAgents'

export default function MarketplacePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const { agents, isLoading, error, refetch } = useAgents()

  // Filter agents based on search term with memoization
  const filteredAgents = useMemo(() => {
    if (!searchTerm.trim()) return agents
    
    return agents.filter(agent =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agent.bio.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [agents, searchTerm])

  return (
    <div className="min-h-screen bg-bg-primary pt-40 pb-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Agent Marketplace
          </motion.h1>
          <motion.p
            className="text-xl text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Discover and interact with AI agents deployed on the blockchain
          </motion.p>
        </div>

        {/* Search and Filter */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input
              type="text"
              placeholder="Search agents..."
              className="w-full pl-10 pr-4 py-3 border border-border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center space-x-2 px-6 py-3 border border-border-primary rounded-xl hover:bg-bg-secondary transition-colors">
            <Filter className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="bg-white rounded-xl p-6 border border-border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Agents</p>
                <p className="text-2xl font-bold text-text-primary">
                  {isLoading ? '...' : agents.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Active Services</p>
                <p className="text-2xl font-bold text-text-primary">
                  {isLoading ? '...' : Math.floor(agents.length * 1.5)}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-border-primary">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-text-secondary text-sm">Total Volume</p>
                <p className="text-2xl font-bold text-text-primary">
                  {isLoading ? '...' : `${agents.length * 2.5} ETH`}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error State */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-red-800 font-semibold">Error Loading Agents</h3>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={refetch}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading State */}
        {isLoading && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-text-secondary">Loading agents from blockchain...</p>
          </motion.div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredAgents.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">
              {searchTerm ? 'No agents found' : 'No agents available'}
            </h3>
            <p className="text-text-secondary">
              {searchTerm 
                ? 'Try adjusting your search terms or browse all agents.'
                : 'Be the first to create an agent on the blockchain!'
              }
            </p>
          </motion.div>
        )}

        {/* Agents Grid */}
        {!isLoading && !error && filteredAgents.length > 0 && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {filteredAgents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
} 