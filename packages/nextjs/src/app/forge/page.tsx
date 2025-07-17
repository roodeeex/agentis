'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowRight, 
  ArrowLeft, 
  Check, 
  Zap, 
  Shield, 
  DollarSign, 
  Eye,
  Upload,
  Code,
  Settings,
  Rocket,
  AlertCircle,
  CheckCircle,
  ExternalLink,
  FileText,
  Calculator,
  TrendingUp
} from 'lucide-react'
import AgentCard from '@/components/AgentCard'
import { useWeb3 } from '@/lib/hooks/useWeb3'
import { useCreateAgent } from '@/lib/hooks/useCreateAgent'
import { Agent } from '@/lib/web3'
import { getTesseractContract } from '@/lib/web3'
import { ethers } from 'ethers'

export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const { isConnected, address } = useWeb3()
  const { createAgent, isLoading, isSuccess, error, transactionHash, reset } = useCreateAgent()
  const [ethPrice, setEthPrice] = useState(2000) // Default ETH price
  const [serviceId, setServiceId] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    imageURI: '',
    contact: '',
    outputURI: '',
    inputSpecsURI: '',
    outputSpecsURI: '', // Added for the new contract
    pricePerTask: '',
  })
  
  // In a real app, you'd fetch this from an API like CoinGecko
  useEffect(() => {
    //
    // const fetchEthPrice = async () => {
    //   try {
    //     const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    //     const data = await response.json();
    //     setEthPrice(data.ethereum.usd);
    //   } catch (e) {
    //     console.error("Could not fetch ETH price", e);
    //   }
    // };
    // fetchEthPrice();
  }, [])


  const [previewAgent, setPreviewAgent] = useState<Agent>({
    id: '999',
    name: 'Your Agent',
    bio: 'Enter a description for your agent...',
    imageURI: '',
    contact: '',
    owner: address || '0x1234...5678',
  })

  const steps = [
    { id: 1, title: 'Identity', icon: Shield },
    { id: 2, title: 'Technical Specs', icon: Code },
    { id: 3, title: 'Pricing & Earnings', icon: DollarSign },
    { id: 4, title: 'Preview & Deploy', icon: Rocket },
  ]

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Update preview agent
    if (field === 'name' || field === 'bio' || field === 'imageURI' || field === 'contact') {
      setPreviewAgent(prev => ({ 
        ...prev, 
        [field]: value || (field === 'name' ? 'Your Agent' : field === 'bio' ? 'Enter a description for your agent...' : prev[field as keyof Agent])
      }))
    }
  }

  const calculateEarnings = () => {
    const price = parseFloat(formData.pricePerTask) || 0
    const platformFee = price * 0.05
    const netEarningPerTask = price - platformFee
    const priceInUsd = price * ethPrice
    
    return {
      priceInUsd,
      platformFee,
      netEarningPerTask,
    }
  }

  const handleSubmit = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first')
      return
    }

    try {
      const result = await createAgent({
        name: formData.name,
        bio: formData.bio,
        imageURI: formData.imageURI,
        contact: formData.contact,
      })
      // After agent creation, create the service
      if (result && result.agentId) {
        const signer = new ethers.providers.Web3Provider(window.ethereum!).getSigner();
        const contract = getTesseractContract(signer);
        const tx = await contract.createService(
          result.agentId,
          formData.bio, // description
          formData.outputURI,
          formData.inputSpecsURI,
          formData.outputSpecsURI,
          ethers.utils.parseEther(formData.pricePerTask || '0')
        )
        const receipt = await tx.wait()
        // Find ServiceCreated event
        const serviceCreatedEvent = receipt.events?.find((event: any) => event.event === 'ServiceCreated')
        if (serviceCreatedEvent) {
          setServiceId(serviceCreatedEvent.args?.serviceId.toString())
        }
      }
      console.log('Agent created successfully:', result)
    } catch (error) {
      console.error('Failed to create agent:', error)
    }
  }

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isStepValid = (step: number) => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.bio.trim() !== ''
      case 2:
        return formData.outputURI.trim() !== '' && formData.inputSpecsURI.trim() !== '' && formData.outputSpecsURI.trim() !== ''
      case 3:
        return formData.pricePerTask.trim() !== '' && parseFloat(formData.pricePerTask) > 0
      case 4:
        return true
      default:
        return true
    }
  }

  const earnings = calculateEarnings()

  return (
    <div className="min-h-screen bg-bg-primary pt-40 pb-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-primary"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Deploy Your AI Agent
          </motion.h1>
          <motion.p
            className="text-xl text-text-secondary max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Create and deploy your AI agent to the blockchain in minutes
          </motion.p>
        </div>

        {/* Wallet Connection Check */}
        {!isConnected && (
          <motion.div
            className="bg-purple-50 border border-purple-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-6 h-6 text-purple-600" />
              <div>
                <h3 className="text-purple-800 font-semibold">Wallet Connection Required</h3>
                <p className="text-purple-600 text-sm mt-1">
                  Please connect your wallet to deploy agents to the blockchain.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {isSuccess && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="text-green-800 font-semibold">Agent Deployed Successfully!</h3>
                  <p className="text-green-600 text-sm mt-1">
                    Your agent has been deployed to the blockchain.<br/>
                    {serviceId && (
                      <span>Service ID: <span className="font-bold">{serviceId}</span></span>
                    )}
                  </p>
                </div>
              </div>
              {transactionHash && (
                <div className="flex items-center space-x-1 text-green-600">
                  <span className="text-sm">TX: {transactionHash.slice(0, 10)}...</span>
                  <CheckCircle className="w-4 h-4" />
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
                <div>
                  <h3 className="text-red-800 font-semibold">Deployment Failed</h3>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-red-600 hover:text-red-700 transition-colors text-sm"
              >
                Try Again
              </button>
            </div>
          </motion.div>
        )}

        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center space-x-6">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                    currentStep >= step.id
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                <div className="ml-3">
                  <div className="text-sm font-medium text-text-primary">
                    {step.title}
                  </div>
                  <div className="text-xs text-text-secondary">
                    Step {step.id}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-5 h-5 text-gray-400 mx-4" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Form Section */}
          <div className="space-y-8">
            {/* Step 1: Identity */}
            {currentStep === 1 && (
              <motion.div
                className="bg-white rounded-xl p-8 border border-border-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Agent Identity
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Agent Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter your agent's name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => updateFormData('bio', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      rows={4}
                      placeholder="Describe what your agent does..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Image URL (optional)
                    </label>
                    <input
                      type="url"
                      value={formData.imageURI}
                      onChange={(e) => updateFormData('imageURI', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://example.com/agent-image.png"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Contact Information (optional)
                    </label>
                    <input
                      type="text"
                      value={formData.contact}
                      onChange={(e) => updateFormData('contact', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Email or contact information"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Technical Specs */}
            {currentStep === 2 && (
              <motion.div
                className="bg-white rounded-xl p-8 border border-border-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Technical Specifications
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Output URI *
                    </label>
                    <input
                      type="url"
                      value={formData.outputURI}
                      onChange={(e) => updateFormData('outputURI', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://api.example.com/agent/deliver"
                    />
                    <p className="text-sm text-text-secondary mt-1">
                      The endpoint where your agent will deliver completed tasks.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Input Specs URI *
                    </label>
                    <input
                      type="url"
                      value={formData.inputSpecsURI}
                      onChange={(e) => updateFormData('inputSpecsURI', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-purple-500"
                      placeholder="https://docs.example.com/agent/input-spec"
                    />
                    <p className="text-sm text-text-secondary mt-1">
                      Documentation URL for your agent's input specifications.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Output Specs URI *
                    </label>
                    <input
                      type="url"
                      value={formData.outputSpecsURI}
                      onChange={(e) => updateFormData('outputSpecsURI', e.target.value)}
                      className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="https://docs.example.com/agent/output-spec"
                    />
                    <p className="text-sm text-text-secondary mt-1">
                      Documentation URL for your agent's output specifications.
                    </p>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <FileText className="w-6 h-6 text-blue-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Technical Requirements</h3>
                        <ul className="text-sm text-text-secondary mt-2 space-y-1">
                          <li>• URIs should be valid HTTPS endpoints</li>
                          <li>• Spec URIs should contain detailed API documentation</li>
                          <li>• All URLs must be publicly accessible</li>
                          <li>• Specifications should include input/output formats</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Pricing & Earnings */}
            {currentStep === 3 && (
              <motion.div
                className="bg-white rounded-xl p-8 border border-border-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Pricing & Earnings Projection
                </h2>
                
                <div className="space-y-6">
                      <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Price Per Task (ETH) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.0001"
                        min="0"
                        value={formData.pricePerTask}
                        onChange={(e) => updateFormData('pricePerTask', e.target.value)}
                        className="w-full px-4 py-3 border border-border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0.01"
                      />
                      {earnings.priceInUsd > 0 && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                          <span className="text-text-secondary text-sm">(~${earnings.priceInUsd.toFixed(2)} USD)</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary mt-1">
                      The total amount customers will pay for one successful task.
                    </p>
                  </div>

                  {/* Earnings Projection */}
                  <div className="bg-green-50 p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-6 h-6 text-green-600" />
                      <h3 className="font-semibold text-text-primary">Per-Task Earning Breakdown</h3>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-text-secondary">Task Price</p>
                        <p className="text-lg font-bold text-text-primary">
                          {parseFloat(formData.pricePerTask || '0').toFixed(4)} ETH
                        </p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-text-secondary">Platform Fee (5%)</p>
                        <p className="text-lg font-bold text-red-600">
                          - {earnings.platformFee.toFixed(4)} ETH
                        </p>
                    </div>
                      <hr className="border-border-secondary"/>
                      <div className="flex justify-between items-center pt-1">
                        <p className="text-sm font-semibold text-text-primary">Your Net Earning</p>
                        <p className="text-xl font-bold text-green-600">
                          {earnings.netEarningPerTask.toFixed(4)} ETH
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <Calculator className="w-6 h-6 text-purple-600 mt-1" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Pricing Tips</h3>
                        <ul className="text-sm text-text-secondary mt-2 space-y-1">
                          <li>• Consider the complexity of your agent's tasks</li>
                          <li>• Research similar agents in the marketplace</li>
                          <li>• Start with competitive pricing to build reputation</li>
                          <li>• The 5% platform fee is automatically deducted</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Preview & Deploy */}
            {currentStep === 4 && (
              <motion.div
                className="bg-white rounded-xl p-8 border border-border-primary"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Deploy to Blockchain
                </h2>
                
                <div className="space-y-6">
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Rocket className="w-6 h-6 text-purple-600" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Ready to Deploy</h3>
                        <p className="text-sm text-text-secondary">
                          Your agent is ready to be deployed to the blockchain
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <div>
                        <h3 className="font-semibold text-text-primary">Deployment Timeline</h3>
                        <p className="text-sm text-text-secondary">
                          Deployment typically takes 30 seconds to 2 minutes
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Configuration Summary */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-text-primary mb-3">Configuration Summary</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Price per task:</span>
                        <span className="font-medium">{formData.pricePerTask || "0"} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Net earning per task:</span>
                        <span className="font-medium text-green-600">{earnings.netEarningPerTask.toFixed(4)} ETH</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-text-secondary">Platform fee:</span>
                        <span className="font-medium">5%</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !isConnected}
                    className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Deploying to Blockchain...</span>
                      </>
                    ) : (
                      <>
                        <Rocket className="w-5 h-5" />
                        <span>Deploy Agent</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-border-primary rounded-lg hover:bg-bg-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Previous</span>
              </button>

              {currentStep < steps.length && (
                <button
                  onClick={nextStep}
                  disabled={!isStepValid(currentStep)}
                  className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-24">
            <motion.div
              className="bg-white rounded-xl p-8 border border-border-primary"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <Eye className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-text-primary">
                  Live Preview
                </h2>
              </div>
              
              <AgentCard agent={previewAgent} />
              
              {/* Additional Preview Info */}
              {currentStep >= 3 && formData.pricePerTask && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-text-primary mb-2">Pricing Info</h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Task Price:</span>
                      <span className="font-medium">{parseFloat(formData.pricePerTask).toFixed(4)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Net Earning:</span>
                      <span className="font-medium text-green-600">{earnings.netEarningPerTask.toFixed(4)} ETH</span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
} 