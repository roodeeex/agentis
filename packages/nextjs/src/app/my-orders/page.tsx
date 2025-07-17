'use client'

import { motion } from 'framer-motion'
import { useMyOrders, Order, OrderStatus } from '@/lib/hooks/useMyOrders'
import { Badge, ShoppingBag, AlertTriangle, RefreshCw } from 'lucide-react'
import { useWeb3 } from '@/lib/hooks/useWeb3'
import { usePayForOrder } from '@/lib/hooks/usePayForOrder'
import { useUpdateOrderStatus } from '@/lib/hooks/useUpdateOrderStatus'
import { Toaster } from 'react-hot-toast'
import { useEffect, useState } from 'react'
import { getTesseractContract, sepoliaProvider } from '@/lib/web3'
import { ethers } from 'ethers'

const statusInfo: { [key in OrderStatus]: { text: string; color: string } } = {
  [OrderStatus.Requested]: { text: 'Requested', color: 'bg-yellow-100 text-yellow-800' },
  [OrderStatus.Accepted]: { text: 'Accepted', color: 'bg-blue-100 text-blue-800' },
  [OrderStatus.Rejected]: { text: 'Rejected', color: 'bg-red-100 text-red-800' },
  [OrderStatus.Created]: { text: 'Paid', color: 'bg-indigo-100 text-indigo-800' },
  [OrderStatus.Delivered]: { text: 'Delivered', color: 'bg-purple-100 text-purple-800' },
  [OrderStatus.Complete]: { text: 'Complete', color: 'bg-green-100 text-green-800' },
  [OrderStatus.Uncomplete]: { text: 'Uncomplete', color: 'bg-gray-100 text-gray-800' },
  [OrderStatus.EvaluatedUncomplete]: { text: 'Pending Dispute', color: 'bg-orange-100 text-orange-800' },
  [OrderStatus.EvaluationDisputed]: { text: 'In Dispute', color: 'bg-pink-100 text-pink-800' },
  [OrderStatus.JustReviewed]: { text: 'Reviewed', color: 'bg-teal-100 text-teal-800' },
  [OrderStatus.ReviewDisputed]: { text: 'Review Disputed', color: 'bg-pink-100 text-pink-800' },
  [OrderStatus.Reviewed]: { text: 'Reviewed', color: 'bg-teal-100 text-teal-800' },
}

const getStatusInfo = (status: OrderStatus) => {
  return statusInfo[status] || { text: 'Unknown', color: 'bg-gray-100 text-gray-800' };
}

export default function MyOrdersPage() {
  const { address } = useWeb3()
  const { orders, isLoading, error, refetch } = useMyOrders()
  const { payForOrder, isPaying } = usePayForOrder()
  const { updateOrderStatus, isUpdating } = useUpdateOrderStatus()
  const [fees, setFees] = useState<{ disputeOrderEvaluationFee: string, disputeReviewFee: string, reviewDeposit: string }>({ disputeOrderEvaluationFee: '0', disputeReviewFee: '0', reviewDeposit: '0' })

  useEffect(() => {
    async function fetchFees() {
      const contract = getTesseractContract(sepoliaProvider)
      const disputeOrderEvaluationFee = await contract.disputeOrderEvaluationFee()
      const disputeReviewFee = await contract.disputeReviewFee()
      const reviewDeposit = await contract.reviewDepositAmount()
      setFees({
        disputeOrderEvaluationFee: ethers.utils.formatEther(disputeOrderEvaluationFee),
        disputeReviewFee: ethers.utils.formatEther(disputeReviewFee),
        reviewDeposit: ethers.utils.formatEther(reviewDeposit),
      })
    }
    fetchFees()
  }, [])

  const handlePay = async (orderId: string, price: string) => {
    await payForOrder(
      orderId,
      price,
      fees.reviewDeposit,
      fees.disputeOrderEvaluationFee,
      fees.disputeReviewFee,
      'ipfs://dummy-input' // TODO: Replace with real input URI from user
    );
    refetch(); // Refetch orders after payment attempt
  };

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await updateOrderStatus(orderId, newStatus);
    refetch(); // Refetch orders after update attempt
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-bg-primary pt-40 pb-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Wallet Not Connected</h2>
          <p className="text-text-secondary">Please connect your wallet to view your orders.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg-primary pt-40 pb-12">
      <Toaster position="top-center" />
      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-4 text-text-primary">
            My Service Orders
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Track the status of all your service requests across the platform.
          </p>
        </motion.div>

        <div className="bg-white rounded-xl p-8 border border-border-primary">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-text-primary">Your Orders</h2>
            <button onClick={refetch} disabled={isLoading} className="text-purple-600 hover:text-purple-700 disabled:opacity-50">
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          {isLoading && (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <p className="mt-4 text-text-secondary">Fetching your orders...</p>
            </div>
          )}
          
          {error && (
            <div className="text-center py-8 text-red-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
              <p>{error}</p>
            </div>
          )}

          {!isLoading && !error && orders.length === 0 && (
            <div className="text-center py-8">
              <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold">No Orders Found</h3>
              <p className="text-text-secondary">You haven't requested any services yet.</p>
            </div>
          )}

          {!isLoading && !error && orders.length > 0 && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Agent</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order: Order) => {
                    const status = getStatusInfo(order.status);
                    return (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">#{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.agentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.price} ETH</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${status.color}`}>
                            {status.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          {order.status === OrderStatus.Accepted && (
                            <button 
                              onClick={() => handlePay(order.id, order.price)}
                              disabled={isPaying || isUpdating}
                              className="text-indigo-600 hover:text-indigo-900 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isPaying ? 'Paying...' : 'Pay Now'}
                            </button>
                          )}
                          {order.status === OrderStatus.Delivered && (
                            <>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, OrderStatus.Complete)}
                                disabled={isUpdating || isPaying}
                                className="text-green-600 hover:text-green-900 mr-4 disabled:opacity-50"
                              >
                                {isUpdating ? 'Updating...' : 'Mark as Complete'}
                              </button>
                              <button 
                                onClick={() => handleUpdateStatus(order.id, OrderStatus.Uncomplete)}
                                disabled={isUpdating || isPaying}
                                className="text-red-600 hover:text-red-900 disabled:opacity-50"
                              >
                                {isUpdating ? 'Updating...' : 'Mark as Uncomplete'}
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 