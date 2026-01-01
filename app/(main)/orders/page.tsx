// app/orders/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store/context/AuthContext';
import { 
  Package, 
  Calendar, 
  IndianRupee, 
  Truck, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  ChevronRight,
  Filter,
  Search,
  Download,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';

// Types
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  totalPrice: number;
  image?: string;
}

interface Order {
  $id: string;
  orderNumber: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  address: string;
  paymentMethod: string;
  shippingCost: number;
  taxAmount: number;
  discountedAmount: number;
  totalAmount: number;
  orderStatus: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  notes: string;
  createdAt: string;
  items?: OrderItem[];
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Mock data - Replace with actual API call
  const mockOrders: Order[] = [
    {
      $id: 'order_1',
      orderNumber: 'ORD-20241215-001',
      userId: 'user_1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      shippingAddress: {},
      address: '101, MG Road, Mumbai - 400001',
      paymentMethod: 'cod',
      shippingCost: 5,
      taxAmount: 10.5,
      discountedAmount: 0,
      totalAmount: 115.5,
      orderStatus: 'delivered',
      paymentStatus: 'paid',
      notes: '',
      createdAt: '2024-12-10T10:30:00Z',
      items: [
        {
          id: 'item_1',
          productId: 'prod_1',
          productName: 'Organic Moringa Powder',
          price: 50,
          quantity: 2,
          totalPrice: 100,
          image: '/images/products/moringa.jpg'
        }
      ]
    },
    {
      $id: 'order_2',
      orderNumber: 'ORD-20241214-002',
      userId: 'user_1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      shippingAddress: {},
      address: '101, MG Road, Mumbai - 400001',
      paymentMethod: 'online',
      shippingCost: 5,
      taxAmount: 8,
      discountedAmount: 10,
      totalAmount: 83,
      orderStatus: 'shipped',
      paymentStatus: 'paid',
      notes: '',
      createdAt: '2024-12-09T14:20:00Z',
      items: [
        {
          id: 'item_2',
          productId: 'prod_2',
          productName: 'Ashwagandha Capsules',
          price: 30,
          quantity: 1,
          totalPrice: 30,
          image: '/images/products/ashwagandha.jpg'
        },
        {
          id: 'item_3',
          productId: 'prod_3',
          productName: 'Turmeric Powder',
          price: 20,
          quantity: 2,
          totalPrice: 40,
          image: '/images/products/turmeric.jpg'
        }
      ]
    },
    {
      $id: 'order_3',
      orderNumber: 'ORD-20241213-003',
      userId: 'user_1',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '9876543210',
      shippingAddress: {},
      address: '101, MG Road, Mumbai - 400001',
      paymentMethod: 'cod',
      shippingCost: 5,
      taxAmount: 5.5,
      discountedAmount: 0,
      totalAmount: 60.5,
      orderStatus: 'processing',
      paymentStatus: 'pending',
      notes: '',
      createdAt: '2024-12-08T09:15:00Z',
      items: [
        {
          id: 'item_4',
          productId: 'prod_4',
          productName: 'Neem Capsules',
          price: 25,
          quantity: 2,
          totalPrice: 50,
          image: '/images/products/neem.jpg'
        }
      ]
    }
  ];

 useEffect(() => {
  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setOrders(mockOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchOrders();
}, [user]); 

  // Filter orders
  const filteredOrders = orders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') {
      const orderDate = new Date(order.createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate > thirtyDaysAgo;
    }
    return order.orderStatus === activeFilter;
  });

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="text-green-600" size={20} />;
      case 'shipped': return <Truck className="text-blue-600" size={20} />;
      case 'processing': return <RefreshCw className="text-yellow-600" size={20} />;
      case 'pending': return <Clock className="text-orange-600" size={20} />;
      case 'cancelled': return <AlertCircle className="text-red-600" size={20} />;
      default: return <Package className="text-gray-600" size={20} />;
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please login to view your orders
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            Sign in to access your order history, track shipments, and manage your purchases
          </p>
          <div className="space-y-4">
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white px-8 py-3">
              <Link href="/login?redirect=/orders">
                Sign In
              </Link>
            </Button>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                New customer?{' '}
                <Link href="/register" className="text-green-600 hover:underline font-medium">
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Orders
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Track, return, or buy things again
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Button 
                variant="outline" 
                className="hidden sm:flex items-center gap-2"
                asChild
              >
                <Link href="/products">
                  Continue Shopping
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'all' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                All Orders
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'recent' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Last 30 Days
              </button>
              <button
                onClick={() => setActiveFilter('delivered')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Delivered
              </button>
              <button
                onClick={() => setActiveFilter('shipped')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'shipped' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Shipped
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <div className="animate-pulse">
                  <div className="flex justify-between items-start mb-4">
                    <div className="space-y-2">
                      <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded"></div>
                      <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </div>
                    <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div className="h-px bg-gray-200 dark:bg-gray-700 my-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-3/4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <Package className="w-24 h-24 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {activeFilter === 'all' ? 'No orders yet' : 'No orders found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {activeFilter === 'all' 
                ? "When you place orders, they'll appear here for easy tracking and management."
                : "Try changing your filters or search for different orders."
              }
            </p>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/products">
                Start Shopping
              </Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div 
                key={order.$id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:shadow-md"
              >
                {/* Order Header */}
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          Order #{order.orderNumber}
                        </h3>
                        <OrderStatusBadge status={order.orderStatus} />
                      </div>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar size={16} />
                          <span>Placed on {formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Package size={16} />
                          <span>{order.items?.length || 0} items</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <IndianRupee size={16} />
                          <span className="font-medium">{order.totalAmount.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:inline-flex items-center gap-2"
                        onClick={() => setExpandedOrder(expandedOrder === order.$id ? null : order.$id)}
                      >
                        {expandedOrder === order.$id ? 'Hide Details' : 'View Details'}
                        <ChevronRight size={16} className={`transition-transform ${expandedOrder === order.$id ? 'rotate-90' : ''}`} />
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        asChild
                      >
                        <Link href={`/orders/${order.$id}`}>
                          <Eye size={16} className="sm:hidden" />
                          <span className="hidden sm:inline">View Order</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="px-6 pb-4">
                  <div className="flex overflow-x-auto gap-4 pb-2">
                    {order.items?.slice(0, 3).map((item, index) => (
                      <div key={item.id} className="flex-shrink-0">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]">
                          <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                            {item.image ? (
                              <div className="w-full h-full bg-gray-300 dark:bg-gray-600 rounded" />
                            ) : (
                              <Package className="text-gray-400" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                              {item.productName}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              Qty: {item.quantity} × ₹{item.price}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    {order.items && order.items.length > 3 && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]">
                          <span className="text-gray-600 dark:text-gray-400">
                            +{order.items.length - 3} more items
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedOrder === order.$id && (
                  <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Order Items Details */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                        <div className="space-y-3">
                          {order.items?.map((item) => (
                            <div key={item.id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center">
                                  <Package size={16} className="text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                                    {item.productName}
                                  </p>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Qty: {item.quantity}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900 dark:text-white">
                                  ₹{item.totalPrice.toFixed(2)}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  ₹{item.price} each
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Order Summary */}
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
                        <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                            <span>₹{(order.totalAmount - order.shippingCost - order.taxAmount + order.discountedAmount).toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Shipping:</span>
                            <span>₹{order.shippingCost.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Tax:</span>
                            <span>₹{order.taxAmount.toFixed(2)}</span>
                          </div>
                          {order.discountedAmount > 0 && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Discount:</span>
                              <span className="text-green-600">-₹{order.discountedAmount.toFixed(2)}</span>
                            </div>
                          )}
                          <Separator />
                          <div className="flex justify-between font-semibold">
                            <span className="text-gray-900 dark:text-white">Total:</span>
                            <span className="text-green-600">₹{order.totalAmount.toFixed(2)}</span>
                          </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Address</h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {order.address}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Phone: {order.customerPhone}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Download size={16} />
                        Invoice
                      </Button>
                      {order.orderStatus === 'delivered' && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-2"
                        >
                          <RefreshCw size={16} />
                          Return/Replace
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                      >
                        <Truck size={16} />
                        Track Order
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2 ml-auto"
                      >
                        <Eye size={16} />
                        View Full Details
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Help Section */}
        {!loading && filteredOrders.length > 0 && (
          <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 border border-green-200 dark:border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Need Help With Your Orders?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Truck className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Track Your Order</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Get real-time updates on your shipment
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <RefreshCw className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Returns & Refunds</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  30-day return policy on most items
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Need Help?</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Call us at 1800-123-4567
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;