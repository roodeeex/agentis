'use client'

import { useState } from 'react'
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
  Rocket
} from 'lucide-react'
import Navigation from '@/components/Navigation'
import AgentCard from '@/components/AgentCard'

export default function ForgePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    capabilities: [] as string[],
    endpoint: '',
    price: '',
    visibility: 'public',
    avatar: null,
  })

  const [previewAgent, setPreviewAgent] = useState({
    id: 999,
    name: 'Your Agent',
    category: 'Select Category',
    description: 'Enter a description for your agent...',
    creator: '0x1234...5678',
    price: 0.1,
    rating: 5.0,
    activeUsers: 0,
    uptime: 100,
    lastActive: new Date(),
  })

  const steps = [
    { id: 1, title: 'Identity', icon: Shield },
    { id: 2, title: 'Technical Specs', icon: Code },
    { id: 3, title: 'Monetization', icon: DollarSign },
    { id: 4, title: 'Preview & Deploy', icon: Rocket },
  ]

  const categories = [
    'Data Analysis',
    'Content Creation',
    'Trading',
    'Automation',
    'Research',
    'Customer Support',
    'Marketing',
    'Development'
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Update preview
    if (field === 'name') {
      setPreviewAgent(prev => ({ ...prev, name: value || 'Your Agent' }))
    } else if (field === 'category') {
      setPreviewAgent(prev => ({ ...prev, category: value || 'Select Category' }))
    } else if (field === 'description') {
      setPreviewAgent(prev => ({ ...prev, description: value || 'Enter a description for your agent...' }))
    } else if (field === 'price') {
      setPreviewAgent(prev => ({ ...prev, price: parseFloat(value) || 0.1 }))
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

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Agent Name *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                placeholder="Enter agent name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Category *
              </label>
              <select
                className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Description *
              </label>
              <textarea
                className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                rows={4}
                placeholder="Describe what your agent does and how it can help users"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Agent Avatar
              </label>
              <div className="border-2 border-dashed border-border-primary rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-text-muted mx-auto mb-4" />
                <p className="text-text-secondary mb-2">
                  Upload an avatar for your agent
                </p>
                <p className="text-sm text-text-muted">
                  PNG, JPG up to 5MB
                </p>
                <button className="mt-4 btn-secondary px-4 py-2 rounded-lg text-sm">
                  Choose File
                </button>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                API Endpoint *
              </label>
              <input
                type="url"
                className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                placeholder="https://your-api.com/agent"
                value={formData.endpoint}
                onChange={(e) => handleInputChange('endpoint', e.target.value)}
              />
              <p className="text-sm text-text-muted mt-2">
                The endpoint where your agent will receive requests
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Capabilities *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Text Processing',
                  'Image Analysis',
                  'Data Analysis',
                  'API Integration',
                  'File Processing',
                  'Real-time Chat',
                  'Scheduled Tasks',
                  'Custom Logic'
                ].map(capability => (
                  <label key={capability} className="flex items-center space-x-2 p-3 rounded-lg border border-border-primary hover:bg-bg-secondary cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-orange-600 focus:ring-orange-500"
                      checked={formData.capabilities.includes(capability)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('capabilities', [...formData.capabilities, capability])
                        } else {
                          handleInputChange('capabilities', formData.capabilities.filter(c => c !== capability))
                        }
                      }}
                    />
                    <span className="text-text-primary">{capability}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Authentication Method
              </label>
              <select className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary">
                <option>API Key</option>
                <option>OAuth 2.0</option>
                <option>JWT Token</option>
                <option>No Authentication</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Rate Limiting
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                    placeholder="100"
                  />
                  <p className="text-sm text-text-muted mt-1">Requests per minute</p>
                </div>
                <div>
                  <input
                    type="number"
                    className="w-full px-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                    placeholder="1000"
                  />
                  <p className="text-sm text-text-muted mt-1">Requests per hour</p>
                </div>
              </div>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Price per Request *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted">$</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-3 rounded-lg border border-border-primary focus:outline-none focus:ring-2 focus:ring-orange-primary bg-bg-primary text-text-primary"
                  placeholder="0.10"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                />
              </div>
              <p className="text-sm text-text-muted mt-2">
                Amount you'll earn per request to your agent
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Revenue Sharing
              </label>
              <div className="card rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Your earnings</span>
                  <span className="text-text-primary font-semibold">85%</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-text-secondary">Platform fee</span>
                  <span className="text-text-primary font-semibold">15%</span>
                </div>
                <div className="border-t border-border-primary mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-text-primary font-semibold">You earn per $1.00 request</span>
                    <span className="text-orange-600 font-bold">$0.85</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Visibility
              </label>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-border-primary hover:bg-bg-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={formData.visibility === 'public'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-text-primary font-medium">Public</div>
                    <div className="text-sm text-text-secondary">Anyone can discover and use your agent</div>
                  </div>
                </label>
                <label className="flex items-center space-x-3 p-3 rounded-lg border border-border-primary hover:bg-bg-secondary cursor-pointer">
                  <input
                    type="radio"
                    name="visibility"
                    value="private"
                    checked={formData.visibility === 'private'}
                    onChange={(e) => handleInputChange('visibility', e.target.value)}
                    className="text-orange-600 focus:ring-orange-500"
                  />
                  <div>
                    <div className="text-text-primary font-medium">Private</div>
                    <div className="text-sm text-text-secondary">Only you and invited users can access</div>
                  </div>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Usage Analytics
              </label>
              <div className="space-y-2">
                {[
                  'Track request volume',
                  'Monitor response times',
                  'User engagement metrics',
                  'Revenue analytics'
                ].map(feature => (
                  <label key={feature} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="rounded text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-text-primary">{feature}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-text-primary mb-2">
                Ready to Deploy!
              </h3>
              <p className="text-text-secondary">
                Review your agent configuration and deploy to the blockchain
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-text-primary mb-4">Agent Summary</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Name:</span>
                    <span className="text-text-primary">{formData.name || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Category:</span>
                    <span className="text-text-primary">{formData.category || 'Not set'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Price:</span>
                    <span className="text-text-primary">${formData.price || '0.00'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Capabilities:</span>
                    <span className="text-text-primary">{formData.capabilities.length} selected</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Visibility:</span>
                    <span className="text-text-primary capitalize">{formData.visibility}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-text-primary mb-4">Deployment Costs</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Smart Contract (L2):</span>
                    <span className="text-text-primary">$0.85</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">IPFS Storage:</span>
                    <span className="text-text-primary">$0.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Network Fee:</span>
                    <span className="text-text-primary">$0.05</span>
                  </div>
                  <div className="border-t border-border-primary pt-2">
                    <div className="flex justify-between font-semibold">
                      <span className="text-text-primary">Total:</span>
                      <span className="text-orange-600">$1.05</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card rounded-lg p-4 bg-orange-50">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-orange-600 mt-1" />
                <div>
                  <h5 className="font-semibold text-orange-900 mb-1">
                    Blockchain Security
                  </h5>
                  <p className="text-sm text-orange-800">
                    Your agent will be deployed as an immutable smart contract, ensuring permanent availability and trustless execution.
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-text-muted mt-2">
                Deployment typically takes 2-5 minutes
              </p>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      {/* Header */}
      <section className="pt-44 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-heading text-5xl md:text-6xl font-bold mb-6 text-text-primary">
              The <span className="gradient-text">Forge</span>
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Create and deploy your AI agent to the blockchain in minutes
            </p>
          </motion.div>

          {/* Progress Steps */}
          <motion.div
            className="flex justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="flex items-center space-x-4">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    currentStep >= step.id
                      ? 'bg-orange-600 border-orange-600 text-white'
                      : 'border-border-primary text-text-muted'
                  }`}>
                    {currentStep > step.id ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <div className="ml-3">
                    <div className={`text-sm font-medium ${
                      currentStep >= step.id ? 'text-text-primary' : 'text-text-muted'
                    }`}>
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-0.5 mx-4 ${
                      currentStep > step.id ? 'bg-orange-600' : 'bg-border-primary'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="card rounded-xl p-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-2xl font-bold text-text-primary mb-6">
                  Step {currentStep}: {steps[currentStep - 1].title}
                </h2>
                
                {renderStepContent()}

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-primary">
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition-colors ${
                      currentStep === 1
                        ? 'text-text-muted cursor-not-allowed'
                        : 'text-text-secondary hover:text-orange-600'
                    }`}
                  >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Previous</span>
                  </button>

                  {currentStep < steps.length ? (
                    <button
                      onClick={nextStep}
                      className="flex items-center space-x-2 btn-primary px-6 py-3 rounded-lg font-semibold"
                    >
                      <span>Next</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  ) : (
                    <button className="flex items-center space-x-2 btn-primary px-6 py-3 rounded-lg font-semibold bg-green-600 hover:bg-green-700">
                      <Rocket className="w-5 h-5" />
                      <span>Deploy</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <motion.div
                className="card rounded-xl p-6 sticky top-24"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <div className="flex items-center space-x-2 mb-6">
                  <Eye className="w-5 h-5 text-orange-600" />
                  <h3 className="text-lg font-semibold text-text-primary">
                    Live Preview
                  </h3>
                </div>
                
                <AgentCard agent={previewAgent} />
                
                <div className="mt-6 p-4 bg-bg-secondary rounded-lg">
                  <h4 className="font-semibold text-text-primary mb-2">
                    Earnings Projection
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">10 requests/day</span>
                      <span className="text-text-primary">${(parseFloat(formData.price) * 10 * 0.85).toFixed(2)}/day</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">300 requests/month</span>
                      <span className="text-orange-600 font-semibold">${(parseFloat(formData.price) * 300 * 0.85).toFixed(2)}/month</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
} 