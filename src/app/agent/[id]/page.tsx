'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Star, 
  Users, 
  Clock, 
  Activity, 
  Shield, 
  Zap, 
  ExternalLink,
  Play,
  Terminal,
  TrendingUp,
  DollarSign
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import { generateMockAgents, formatCurrency, formatDate } from '@/lib/utils'
import { useParams, useRouter } from 'next/navigation'

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [agent, setAgent] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'activity' | 'history'>('details')
  const [liveActivity, setLiveActivity] = useState<any[]>([])

  useEffect(() => {
    const agents = generateMockAgents()
    const foundAgent = agents.find(a => a.id === parseInt(params.id as string))
    setAgent(foundAgent)

    // Generate mock live activity
    const activities = [
      { time: '2024-01-15 15:11:47', type: 'heartbeat', message: 'Heartbeat acknowledged. Status: Active' },
      { time: '2024-01-15 15:10:23', type: 'task', message: 'Task completed: Data analysis request' },
      { time: '2024-01-15 15:08:15', type: 'payment', message: 'Payment received: 0.05 ETH' },
      { time: '2024-01-15 15:05:42', type: 'task', message: 'New task initiated: Content generation' },
      { time: '2024-01-15 15:03:12', type: 'heartbeat', message: 'System optimization completed' },
    ]
    setLiveActivity(activities)
  }, [params.id])

  if (!agent) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <div className="text-center">
          <Activity className="w-16 h-16 text-orange-600 mx-auto mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold text-text-primary mb-2">Loading Agent...</h2>
          <p className="text-text-secondary">Please wait while we fetch the agent details</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      {/* Header */}
      <section className="pt-44 pb-12 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-text-secondary hover:text-orange-600 transition-colors mb-6"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Marketplace</span>
            </button>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Agent Info */}
              <div className="lg:col-span-2">
                <div className="card rounded-xl p-8">
                  <div className="flex items-start space-x-6 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center">
                      <Zap className="w-8 h-8 text-orange-600" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h1 className="text-3xl font-bold text-text-primary">{agent.name}</h1>
                        <div className="flex items-center space-x-1">
                          <Star className="w-5 h-5 text-yellow-400 fill-current" />
                          <span className="text-text-primary font-semibold">{agent.rating}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4 text-sm text-text-secondary mb-4">
                        <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                          {agent.category}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-4 h-4" />
                          <span>{agent.activeUsers} active users</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>{agent.uptime}% uptime</span>
                        </span>
                      </div>
                      
                      <p className="text-text-secondary leading-relaxed">
                        {agent.description}
                      </p>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-border-primary mb-6">
                    <nav className="flex space-x-8">
                      {[
                        { id: 'details', label: 'Details' },
                        { id: 'activity', label: 'Live Activity' },
                        { id: 'history', label: 'History' }
                      ].map(tab => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                            activeTab === tab.id
                              ? 'border-orange-600 text-orange-600'
                              : 'border-transparent text-text-secondary hover:text-text-primary hover:border-border-primary'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </nav>
                  </div>

                  {/* Tab Content */}
                  <div className="min-h-96">
                    {activeTab === 'details' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Agent Capabilities
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            {[
                              'Natural Language Processing',
                              'Data Analysis',
                              'Real-time Processing',
                              'API Integration',
                              'Automated Reporting',
                              'Pattern Recognition'
                            ].map(capability => (
                              <div key={capability} className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                                <span className="text-text-secondary">{capability}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Performance Metrics
                          </h3>
                          <div className="grid grid-cols-2 gap-6">
                            <div className="bg-bg-secondary rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <TrendingUp className="w-5 h-5 text-green-600" />
                                <span className="text-text-secondary">Success Rate</span>
                              </div>
                              <div className="text-2xl font-bold text-text-primary">98.5%</div>
                            </div>
                            <div className="bg-bg-secondary rounded-lg p-4">
                              <div className="flex items-center space-x-2 mb-2">
                                <Clock className="w-5 h-5 text-blue-600" />
                                <span className="text-text-secondary">Avg Response Time</span>
                              </div>
                              <div className="text-2xl font-bold text-text-primary">1.2s</div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-text-primary mb-4">
                            Creator Information
                          </h3>
                          <div className="bg-bg-secondary rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                                <span className="text-orange-600 font-semibold text-sm">
                                  {agent.creator.slice(2, 4).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="font-semibold text-text-primary">
                                  {agent.creator}
                                </div>
                                <div className="text-sm text-text-secondary">
                                  Verified Creator
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'activity' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center space-x-2 mb-4">
                          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-text-primary font-semibold">Live Activity Feed</span>
                        </div>
                        
                        <div className="space-y-3">
                          {liveActivity.map((activity, index) => (
                            <div key={index} className="bg-bg-secondary rounded-lg p-4">
                              <div className="flex items-start space-x-3">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                  activity.type === 'heartbeat' ? 'bg-green-100 text-green-600' :
                                  activity.type === 'task' ? 'bg-blue-100 text-blue-600' :
                                  'bg-orange-100 text-orange-600'
                                }`}>
                                  {activity.type === 'heartbeat' ? <Activity className="w-4 h-4" /> :
                                   activity.type === 'task' ? <Terminal className="w-4 h-4" /> :
                                   <DollarSign className="w-4 h-4" />}
                                </div>
                                <div className="flex-1">
                                  <div className="text-text-primary font-medium">
                                    {activity.message}
                                  </div>
                                  <div className="text-sm text-text-muted">
                                    {activity.time}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}

                    {activeTab === 'history' && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-4"
                      >
                        <div className="text-center py-12">
                          <TrendingUp className="w-16 h-16 text-text-muted mx-auto mb-4" />
                          <h3 className="text-xl font-semibold text-text-primary mb-2">
                            Historical Data
                          </h3>
                          <p className="text-text-secondary">
                            Performance history and analytics will be available here
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Purchase/Interact */}
                <div className="card rounded-xl p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-text-primary mb-2">
                      ${agent.price.toFixed(2)}
                    </div>
                    <div className="text-text-secondary">per request</div>
                  </div>
                  
                  <motion.button
                    className="w-full btn-primary px-6 py-4 rounded-lg font-semibold text-lg mb-4"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <Play className="w-5 h-5" />
                      <span>Try Agent</span>
                    </div>
                  </motion.button>
                  
                  <div className="text-center">
                    <a
                      href="#"
                      className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center justify-center space-x-1"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>View API Documentation</span>
                    </a>
                  </div>
                </div>

                {/* Stats */}
                <div className="card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Agent Statistics
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Total Requests</span>
                      <span className="text-text-primary font-semibold">2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Revenue Generated</span>
                      <span className="text-text-primary font-semibold">$2,847</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Active Since</span>
                      <span className="text-text-primary font-semibold">Jan 2024</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text-secondary">Last Updated</span>
                      <span className="text-text-primary font-semibold">2 hours ago</span>
                    </div>
                  </div>
                </div>

                {/* Security */}
                <div className="card rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-text-primary mb-4">
                    Security & Trust
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-text-secondary">Blockchain Verified</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-text-secondary">Smart Contract Audited</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-5 h-5 text-green-600" />
                      <span className="text-text-secondary">Immutable Code</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
} 