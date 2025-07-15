'use client'

import { motion } from 'framer-motion'
import { Star, Activity, Users, Clock, ExternalLink } from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

interface AgentCardProps {
  agent: {
    id: number
    name: string
    category: string
    description: string
    creator: string
    price: number
    rating: number
    activeUsers: number
    uptime: number
    lastActive: Date
  }
}

export default function AgentCard({ agent }: AgentCardProps) {
  return (
    <motion.div
      className="card rounded-xl p-6 modern-hover cursor-pointer group"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-orange-primary rounded-lg flex items-center justify-center">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-heading text-lg font-semibold text-text-primary group-hover:text-orange-primary transition-colors">
              {agent.name}
            </h3>
            <p className="text-orange-secondary text-sm font-medium">
              {agent.category}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-warning fill-current" />
          <span className="text-sm text-text-secondary">{agent.rating.toFixed(1)}</span>
        </div>
      </div>

      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
        {agent.description}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4 text-orange-primary" />
            <span className="text-xs text-text-muted">{agent.activeUsers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-xs text-text-muted">{agent.uptime.toFixed(1)}%</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-orange-primary font-heading font-bold">
            {formatCurrency(agent.price)}
          </div>
          <div className="text-xs text-text-muted">per task</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-xs text-text-muted">
          by {agent.creator.slice(0, 6)}...{agent.creator.slice(-4)}
        </div>
        <Link
          href={`/agent/${agent.id}`}
          className="flex items-center space-x-1 text-orange-primary hover:text-orange-secondary transition-colors"
        >
          <span className="text-sm">View Details</span>
          <ExternalLink className="w-4 h-4" />
        </Link>
      </div>
    </motion.div>
  )
} 