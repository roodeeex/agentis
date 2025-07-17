'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Star, Users, Clock, Shield, ExternalLink, Copy, Bot, CheckCircle, Zap } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useAgent } from '@/lib/hooks/useAgents'
import { useWeb3 } from '@/lib/hooks/useWeb3'
import { useRequestOrder } from '@/lib/hooks/useRequestOrder' // Import the new hook
import { getTesseractContract, sepoliaProvider } from '@/lib/web3'

function AgentDetailContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const agentId = searchParams.get('id')
  const { agent, isLoading, error } = useAgent(agentId || '')
  const { isConnected, address } = useWeb3()
  const [copied, setCopied] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false)
  const { 
    requestOrder, 
    isLoading: isRequesting, 
    isSuccess: isRequestSuccess, 
    error: requestError,
    orderId,
    reset
  } = useRequestOrder()

  // Fetch serviceId for this agent
  useEffect(() => {
    async function fetchServiceId() {
      if (!agentId) return;
      const contract = getTesseractContract(sepoliaProvider)
      const serviceIds = await contract.getAgentServices(agentId)
      if (serviceIds && serviceIds.length > 0) {
        setServiceId(serviceIds[0].toString())
      }
    }
    fetchServiceId()
  }, [agentId])

  const handleRequestSubmit = async () => {
    if (!serviceId) {
      alert("This agent doesn't have a valid service to request.")
      return
    }

    // For now, we use predefined review questions. This could be made dynamic in the future.
    const orderData = {
      serviceId: parseInt(serviceId),
      objQuestions: ["Was the task completed on time?", "Was the output high quality?"],
      subjQuestions: ["Any feedback for the agent?"],
      objWeights: [50, 50],
      subjWeights: [100],
    };

    try {
      await requestOrder(orderData);
    } catch (e) {
      // Error is already handled inside the hook
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const placeholderRating = agent ? 4.2 + (parseInt(agent.id) % 10) * 0.1 : 4.2
  const placeholderUsers = agent ? 10 + (parseInt(agent.id) % 50) : 10
  const placeholderUptime = agent ? 95 + (parseInt(agent.id) % 5) : 95

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <p className="mt-4 text-text-secondary">Loading agent details...</p>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bot className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-semibold text-text-primary mb-2">
          Agent Not Found
        </h3>
        <p className="text-text-secondary mb-6">
          {error || 'The requested agent could not be found.'}
        </p>
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 mx-auto px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </button>
      </div>
    )
  }

  return (
    <>
      <motion.button
        onClick={() => router.back()}
        className="flex items-center space-x-2 text-text-secondary hover:text-purple-600 transition-colors mb-8"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Marketplace</span>
      </motion.button>

      <motion.div
        className="bg-white rounded-xl p-8 border border-border-primary mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 bg-purple-primary rounded-xl flex items-center justify-center flex-shrink-0">
            {agent.imageURI ? (
              <img 
                src={agent.imageURI} 
                alt={agent.name}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                  (e.currentTarget.nextElementSibling as HTMLElement)?.classList.remove('hidden')
                }}
              />
            ) : null}
            <Bot className={`w-10 h-10 text-white ${agent.imageURI ? 'hidden' : ''}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold text-text-primary mb-2">
                  {agent.name}
                </h1>
                <p className="text-text-secondary mb-4">
                  {agent.bio || 'No description available'}
                </p>
                
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-warning fill-current" />
                    <span className="text-sm text-text-secondary">
                      {placeholderRating.toFixed(1)} rating
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-primary" />
                    <span className="text-sm text-text-secondary">
                      {placeholderUsers} users
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-success" />
                    <span className="text-sm text-text-secondary">
                      {placeholderUptime}% uptime
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-purple-primary font-heading font-bold text-2xl">
                  On-Chain
                </div>
                <div className="text-sm text-text-secondary">deployed</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            className="bg-white rounded-xl p-8 border border-border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Agent Information
            </h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-text-primary mb-2">Description</h3>
                <p className="text-text-secondary">
                  {agent.bio || 'No description provided for this agent.'}
                </p>
              </div>

              {agent.contact && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Contact</h3>
                  <p className="text-text-secondary">{agent.contact}</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-text-primary mb-2">Owner</h3>
                <div className="flex items-center space-x-3">
                  <span className="text-text-secondary font-mono">
                    {formatAddress(agent.owner)}
                  </span>
                  <button
                    onClick={() => copyToClipboard(agent.owner)}
                    className="flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                  >
                    {copied ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-text-primary mb-2">Agent ID</h3>
                <span className="text-text-secondary font-mono">#{agent.id}</span>
              </div>
              {serviceId && (
                <div>
                  <h3 className="font-semibold text-text-primary mb-2">Service ID</h3>
                  <span className="text-text-secondary font-mono">#{serviceId}</span>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-8 border border-border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-6">
              Blockchain Details
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <Shield className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-800">Verified On-Chain</h3>
                  <p className="text-green-600 text-sm">
                    This agent is deployed and verified on the blockchain
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-1">Network</h4>
                  <p className="text-text-secondary text-sm">Sepolia Testnet</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-1">Token Standard</h4>
                  <p className="text-text-secondary text-sm">ERC-721 (NFT)</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Request Service Section */}
          <motion.div
            className="bg-white rounded-xl p-8 border border-border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-2xl font-bold text-text-primary mb-4">
              Request Service
            </h2>
            <p className="text-text-secondary mb-6">
              Ready to put this agent to work? Initiate a new service request to get started.
            </p>
            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={!isConnected}
            >
              <Zap className="w-5 h-5" />
              <span>Request Service from Agent</span>
            </button>
            {!isConnected && (
              <p className="text-center text-sm text-red-500 mt-4">
                You must connect your wallet to request a service.
              </p>
            )}
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-xl p-6 border border-border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Quick Actions
            </h3>
            
            <div className="space-y-3">
              <button 
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                disabled={!isConnected}
              >
                <ExternalLink className="w-5 h-5" />
                <span>Interact with Agent</span>
              </button>
              
              <button className="w-full border border-border-primary py-3 px-4 rounded-lg font-semibold hover:bg-bg-secondary transition-colors">
                Share Agent
              </button>
              
              {isConnected && address === agent.owner && (
                <button className="w-full border border-purple-600 text-purple-600 py-3 px-4 rounded-lg font-semibold hover:bg-purple-50 transition-colors">
                  Manage Agent
                </button>
              )}
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 border border-border-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-lg font-bold text-text-primary mb-4">
              Agent Stats
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Active Users</span>
                <span className="font-semibold text-text-primary">{placeholderUsers}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Uptime</span>
                <span className="font-semibold text-text-primary">{placeholderUptime}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Rating</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-warning fill-current" />
                  <span className="font-semibold text-text-primary">
                    {placeholderRating.toFixed(1)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-text-secondary">Blockchain ID</span>
                <span className="font-semibold text-text-primary">#{agent.id}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Request Service Modal */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-8 max-w-lg w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            {!isRequestSuccess ? (
              <>
                <h2 className="text-2xl font-bold mb-4">New Service Request</h2>
                <p className="text-text-secondary mb-6">You are about to request a service from <span className="font-bold">{agent.name}</span>. This will initiate an on-chain transaction.</p>
                
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold text-text-primary mb-2">Review Criteria</h3>
                  <p className="text-sm text-text-secondary">
                    After the service, you'll be asked to review based on timeliness and quality.
                  </p>
                </div>
                
                {requestError && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
                    {requestError}
                  </div>
                )}

                <div className="flex justify-end space-x-4 mt-6">
                  <button 
                    onClick={() => {
                      setIsRequestModalOpen(false)
                      reset()
                    }}
                    className="px-6 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-50"
                    disabled={isRequesting}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleRequestSubmit}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                    disabled={isRequesting}
                  >
                    {isRequesting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <span>Submit Request</span>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">Request Submitted!</h2>
                <p className="text-text-secondary mb-4">
                  Your service request has been sent to the agent owner.
                </p>
                <p className="text-sm text-text-secondary">
                  Order ID: <span className="font-mono bg-gray-100 p-1 rounded">{orderId}</span>
                </p>
                <button 
                  onClick={() => {
                    setIsRequestModalOpen(false)
                    reset()
                  }}
                  className="mt-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}

export default function AgentDetailPage() {
  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        <Suspense fallback={<div>Loading...</div>}>
          <AgentDetailContent />
        </Suspense>
      </div>
    </div>
  )
} 