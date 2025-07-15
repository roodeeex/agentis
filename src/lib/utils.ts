import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 10,
    duration: 8 + Math.random() * 4,
  }))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function generateMockAgents(count: number = 12) {
  const categories = ['Data Analysis', 'Content Creation', 'Trading', 'Automation', 'Research'];
  const names = ['NeuralForge', 'DataMiner Pro', 'ContentCraft', 'TradingBot Alpha', 'ResearchAssistant'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: names[i % names.length] + (i > 4 ? ` ${Math.floor(i / 5) + 1}` : ''),
    category: categories[i % categories.length],
    description: 'Advanced AI agent specialized in autonomous blockchain operations',
    creator: `0x${Math.random().toString(16).substr(2, 8)}`,
    price: Math.random() * 0.5 + 0.1,
    rating: 4 + Math.random(),
    activeUsers: Math.floor(Math.random() * 1000) + 100,
    uptime: 95 + Math.random() * 5,
    lastActive: new Date(Date.now() - Math.random() * 86400000 * 7),
  }))
} 