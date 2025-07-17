'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, Star, Users, Clock, Shield, ExternalLink, Copy, Bot, CheckCircle } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAgent } from '@/lib/hooks/useAgents'
import { useWeb3 } from '@/lib/hooks/useWeb3'
import { getTesseractContract, sepoliaProvider } from '@/lib/web3'
import { useRequestOrder } from '@/lib/hooks/useRequestOrder'
import { Toaster, toast } from 'react-hot-toast'

export default function AgentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const agentId = params.id as string
  const { agent, isLoading: isAgentLoading, error } = useAgent(agentId)
  const { isConnected, address } = useWeb3()
  const { requestOrder, isLoading: isRequesting, isSuccess, orderId: newOrderId, error: requestError, reset } = useRequestOrder()
  const [copied, setCopied] = useState(false)
  const [serviceId, setServiceId] = useState<string | null>(null)

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
  
  useEffect(() => {
    if (requestError) {
      toast.error(`Error: ${requestError}`)
      reset()
    }
    if (isSuccess && newOrderId) {
      toast.success(`Successfully requested Order #${newOrderId}!`)
      reset()
    }
  }, [isSuccess, newOrderId, requestError, reset])

  const handleRequestService = async () => {
    if (!serviceId) return
    
    // NOTE: The contract expects these extra fields.
    // In a real app, you would have a form to collect this data.
    const dummyOrderData = {
      serviceId: parseInt(serviceId),
      objQuestions: [],
      subjQuestions: [],
      objWeights: [],
      subjWeights: [],
    }
    
    await requestOrder(dummyOrderData)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  // Generate placeholder values for missing fields
  const placeholderRating = agent ? 4.2 + (parseInt(agent.id) % 10) * 0.1 : 4.2
  const placeholderUsers = agent ? 10 + (parseInt(agent.id) % 50) : 10
  const placeholderUptime = agent ? 95 + (parseInt(agent.id) % 5) : 95

  if (isAgentLoading) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            <p className="mt-4 text-text-secondary">Loading agent details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-bg-primary pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4">
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
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-32 pb-12">
      <Toaster position="top-center" />
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Button */}
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

        {/* Agent Header */}
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
                    e.currentTarget.style.display = 'none'
                    e.currentTarget.nextElementSibling?.classList.remove('hidden')
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
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Agent Information */}
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

            {/* Blockchain Information */}
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
                    <p className="text-text-secondary text-sm">Ethereum (Local)</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-text-primary mb-1">Token Standard</h4>
                    <p className="text-text-secondary text-sm">ERC-721 (NFT)</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1 space-y-8">
            <motion.div
              className="bg-white rounded-xl p-6 border border-border-primary"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
                <button 
                onClick={handleRequestService}
                disabled={!isConnected || isRequesting || !serviceId}
                className="w-full bg-purple-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                {isRequesting ? 'Requesting...' : 'Request Service'}
                </button>
              {!isConnected && <p className="text-center text-sm text-red-500 mt-2">Connect wallet to request</p>}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 