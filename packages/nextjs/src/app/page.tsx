'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Zap, Shield, Network, ChevronDown, Check, Star, Users, DollarSign, Clock, Award, Sparkles, Bot, Cpu, Rocket, Code, Brain } from 'lucide-react'
import Navigation from '@/components/Navigation'
import AgentCard from '@/components/AgentCard'
import { generateMockAgents } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LandingPage() {
  const [agents, setAgents] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    setAgents(generateMockAgents().slice(0, 6))
  }, [])

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-bg-primary">
      <Navigation />
      
      {/* Hero Section */}
      <section className="h-screen flex items-center justify-center px-4 pt-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
          <div className="absolute bottom-32 left-32 w-1.5 h-1.5 bg-purple-600 rounded-full animate-bounce"></div>
          <div className="absolute bottom-40 right-20 w-1 h-1 bg-purple-500 rounded-full animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center">
            {/* Innovation Badge */}
            <motion.div
              className="flex items-center justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-gradient-to-r from-purple-100 to-purple-100 px-6 py-3 rounded-full flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">
                  🚀 Built for the Future • Powered by AI
                </span>
              </div>
            </motion.div>

            <motion.h1
              className="font-heading text-6xl md:text-8xl font-bold mb-8 text-text-primary"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="block">The Future of</span>
              <span className="gradient-text">AI Agents</span>
              <span className="block text-4xl md:text-5xl mt-2 text-text-secondary">
                is On-Chain
              </span>
            </motion.h1>
            
            <motion.p
              className="text-xl md:text-2xl text-text-secondary mb-12 max-w-4xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Deploy autonomous AI agents on the blockchain. Create, discover, and interact with intelligent agents that never sleep, never stop, and never forget.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.button
                className="bg-purple-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
                onClick={() => router.push('/forge')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Bot className="w-5 h-5" />
                <span>Deploy Your Agent</span>
              </motion.button>
              
              <motion.button
                className="flex items-center space-x-2 text-text-secondary hover:text-purple-600 transition-colors bg-white border-2 border-border-primary px-8 py-4 rounded-full font-semibold text-lg hover:border-purple-200"
                onClick={() => router.push('/marketplace')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>Explore Agents</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Innovation Showcase */}
      <section className="py-20 px-4 bg-gradient-to-b from-purple-50 to-purple-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Revolutionary AI Infrastructure
            </h2>
            <p className="text-xl text-text-secondary max-w-3xl mx-auto">
              We're building the next generation of AI agent infrastructure on the blockchain
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="space-y-6">
                {[
                  {
                    icon: Code,
                    title: "No-Code Agent Builder",
                    description: "Visual interface for creating complex AI agents without programming"
                  },
                  {
                    icon: Rocket,
                    title: "Instant Deployment",
                    description: "Deploy your agent to the blockchain in seconds, not hours"
                  },
                  {
                    icon: Cpu,
                    title: "AI-Powered Optimization",
                    description: "Self-optimizing agents that learn and improve over time"
                  }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                  >
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-text-primary mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-text-secondary">
                        {feature.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-border-primary">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-text-primary mb-2">
                    Live Agent Demo
                  </h3>
                  <p className="text-text-secondary">
                    Watch an AI agent process requests in real-time
                  </p>
                </div>
                
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400 min-h-32">
                  <div className="mb-2">$ agent.execute()</div>
                  <div className="text-blue-400 mb-2">→ Processing request...</div>
                  <div className="text-yellow-400 mb-2">→ Analyzing data...</div>
                  <div className="text-green-400">✓ Task completed successfully</div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              From Idea to Deployment
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Three simple steps to launch your AI agent into the decentralized world
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Design Your Agent",
                description: "Use our intuitive builder to create an AI agent with custom capabilities and behaviors",
                step: "01"
              },
              {
                icon: Shield,
                title: "Deploy to Blockchain",
                description: "Your agent becomes an immutable smart contract, living permanently on the blockchain",
                step: "02"
              },
              {
                icon: Network,
                title: "Connect & Interact",
                description: "Users can discover and interact with your agent through our decentralized network",
                step: "03"
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                className="card rounded-2xl p-8 text-center group modern-hover relative overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-purple-500"></div>
                
                <div className="relative mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center">
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {item.step}
                    </span>
                  </div>
                </div>
                
                <h3 className="font-heading text-xl font-bold mb-4 text-text-primary">
                  {item.title}
                </h3>
                
                <p className="text-text-secondary leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Agents Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-text-primary">
              Featured AI Agents
            </h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Discover cutting-edge AI agents built by our community of innovators
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((agent, index) => (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
              >
                <AgentCard agent={agent} />
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.button
              className="bg-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-purple-700 transition-colors"
              onClick={() => router.push('/marketplace')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore All Agents
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">
              Ready to Build the Future?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join the next generation of AI builders and deploy your first agent today.
            </p>
            
            <motion.button
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center space-x-2"
              onClick={() => router.push('/forge')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Rocket className="w-5 h-5" />
              <span>Start Building Now</span>
            </motion.button>
            
            <div className="mt-6 flex items-center justify-center space-x-8 text-sm opacity-80">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Deploy in minutes</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Blockchain secure</span>
              </div>
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" />
                <span>Forever autonomous</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border-primary py-12 px-4 bg-bg-secondary">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-purple-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="font-heading text-xl font-bold text-text-primary">
              Agentis
            </span>
          </div>
          <p className="text-text-muted">
            © 2025 Agentis. Building the future of AI agents.
          </p>
        </div>
      </footer>
    </div>
  )
} 