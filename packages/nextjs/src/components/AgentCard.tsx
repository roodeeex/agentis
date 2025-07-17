'use client'

import { motion } from 'framer-motion'
import { Star, Users, Clock, ExternalLink, Bot } from 'lucide-react'
import Link from 'next/link'
import { AgentWithPrice } from '@/lib/hooks/useAgents'

interface AgentCardProps {
  agent: AgentWithPrice
}

export default function AgentCard({ agent }: AgentCardProps) {
  // Format address for display
  const formatAddress = (address: string) => {
    if (!address || typeof address !== 'string' || address.length < 10) {
      return 'Not Available'
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  // Generate placeholder values for missing fields
  const placeholderRating = agent.id ? 4.2 + (parseInt(agent.id) % 10) * 0.1 : 4.2
  const placeholderUsers = agent.id ? 10 + (parseInt(agent.id) % 50) : 10
  const placeholderUptime = agent.id ? 95 + (parseInt(agent.id) % 5) : 95

  return (
    <Link href={`/agent/${agent.id}`} passHref>
    <motion.div
        className="card rounded-xl p-6 modern-hover cursor-pointer group h-full flex flex-col"
      whileHover={{ scale: 1.02, y: -5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-primary rounded-lg flex items-center justify-center">
            {agent.imageURI ? (
              <img 
                src={agent.imageURI} 
                alt={agent.name}
                className="w-8 h-8 rounded-md object-cover"
                onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                    (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden');
                }}
              />
            ) : null}
            <Bot className={`w-6 h-6 text-white ${agent.imageURI ? 'hidden' : ''}`} />
          </div>
          <div>
              <h3 className="font-heading text-lg font-semibold text-text-primary group-hover:text-purple-primary transition-colors">
              {agent.name}
            </h3>
              <p className="text-purple-secondary text-sm font-medium">
              AI Agent
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Star className="w-4 h-4 text-warning fill-current" />
          <span className="text-sm text-text-secondary">{placeholderRating.toFixed(1)}</span>
        </div>
      </div>

        <p className="text-text-secondary text-sm mb-4 line-clamp-2 flex-grow">
        {agent.bio || 'No description available'}
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
              <Users className="w-4 h-4 text-purple-primary" />
            <span className="text-xs text-text-muted">{placeholderUsers}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4 text-success" />
            <span className="text-xs text-text-muted">{placeholderUptime}%</span>
          </div>
        </div>
          {agent.price && (
        <div className="text-right">
              <div className="text-purple-primary font-heading font-bold">
                {agent.price} ETH
              </div>
              <div className="text-xs text-text-muted">per task</div>
          </div>
          )}
      </div>

        <div className="flex items-center justify-between pt-4 border-t border-border-primary">
        <div className="text-xs text-text-muted">
          by {formatAddress(agent.owner)}
        </div>
          <div
            className="flex items-center space-x-1 text-purple-primary hover:text-purple-secondary transition-colors"
        >
          <span className="text-sm">View Details</span>
          <ExternalLink className="w-4 h-4" />
          </div>
        </div>
    </motion.div>
    </Link>
  )
} 