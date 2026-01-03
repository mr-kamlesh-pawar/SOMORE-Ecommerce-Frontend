// app/orders/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/store/context/AuthContext';
import { 
  getOrderItems,
  getUserOrders,
  type Order,
  type OrderItem
} from '@/lib/order-service';
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
  Search,
  Download,
  Eye,
  HelpCircle,
  Phone,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import Image from 'next/image';

// Extended Order type with items
interface OrderWithItems extends Order {
  items: OrderItem[];
}

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching orders for user:', user.$id);
        
        // Fetch orders
        const fetchedOrders = await getUserOrders(user.$id);
        console.log('Fetched orders:', fetchedOrders.length);
        
        // Fetch items for each order
        const ordersWithItemsPromises = fetchedOrders.map(async (order) => {
          try {
            console.log(`Fetching items for order ${order.orderNumber} (${order.$id})`);
            const items = await getOrderItems(order.$id);
            console.log(`Found ${items.length} items for order ${order.orderNumber}`);
            console.log("items: ", items);
            
            return {
              ...order,
              items
            };
          } catch (itemError) {
            console.error(`Error fetching items for order ${order.$id}:`, itemError);
            return {
              ...order,
              items: []
            };
          }
        });
        
        const ordersWithItems = await Promise.all(ordersWithItemsPromises);
        console.log('Total orders with items:', ordersWithItems.length);
        setOrders(ordersWithItems);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setError('Failed to load orders. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersWithItems();
  }, [user]);

  // Filter orders
  const filteredOrders = orders.filter(order => {
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        order.orderNumber.toLowerCase().includes(query) ||
        order.customerName.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        order.items.some(item => 
          item.productName.toLowerCase().includes(query)
        )
      );
    }
    
    // Apply status filter
    if (activeFilter === 'all') return true;
    if (activeFilter === 'recent') {
      const orderDate = new Date(order.$createdAt);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return orderDate > thirtyDaysAgo;
    }
    return order.orderStatus === activeFilter;
  });

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  // Format time
  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return '';
    }
  };

  // Calculate subtotal
  const calculateSubtotal = (order: OrderWithItems) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.totalPrice, 0);
    return itemsTotal;
  };

  // Parse shipping address
  const parseAddress = (addressString: string) => {
    try {
      const address = JSON.parse(addressString);
      return address;
    } catch {
      return null;
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
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
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <p className="font-medium">{error}</p>
            </div>
          </div>
        )}

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
                onClick={() => setActiveFilter('pending')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'pending' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Pending
              </button>
              <button
                onClick={() => setActiveFilter('processing')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'processing' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Processing
              </button>
              <button
                onClick={() => setActiveFilter('delivered')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeFilter === 'delivered' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
              >
                Delivered
              </button>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by order number, name, or products..."
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
              {searchQuery ? 'No orders found' : activeFilter === 'all' ? 'No orders yet' : `No ${activeFilter} orders`}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchQuery 
                ? "Try a different search term or clear the search filter."
                : activeFilter === 'all' 
                  ? "When you place orders, they'll appear here for easy tracking and management."
                  : "You don't have any orders with this status."
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
            {filteredOrders.map((order) => {
              const parsedAddress = parseAddress(order.shippingAddress);
              const totalItems = order.items.length;
              
              return (
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
                            <span>Placed on {formatDate(order.$createdAt)} at {formatTime(order.$createdAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Package size={16} />
                            <span>{totalItems} item{totalItems !== 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <IndianRupee size={16} />
                            <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
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
                  {totalItems > 0 && (
                    <div className="px-6 pb-4">
                      <div className="flex overflow-x-auto gap-4 pb-2">
                        {order.items.slice(0, 3).map((item) => (
                          <div key={item.$id} className="flex-shrink-0">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]">
                              <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <div className="relative w-full h-full">
                                    <Image
                                      src={item.image}
                                      alt={item.productName}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  </div>
                                ) : (
                                  <ImageIcon className="text-gray-400" size={20} />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">
                                  {item.productName}
                                </p>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Qty: {item.quantity} × ₹{item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                        {totalItems > 3 && (
                          <div className="flex-shrink-0">
                            <div className="flex items-center justify-center p-3 bg-gray-50 dark:bg-gray-900 rounded-lg min-w-[200px]">
                              <span className="text-gray-600 dark:text-gray-400">
                                +{totalItems - 3} more items
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expanded Details */}
                  {expandedOrder === order.$id && (
                    <div className="border-t border-gray-200 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-900/50">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Order Items Details */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Items</h4>
                          {totalItems > 0 ? (
                            <div className="space-y-3">
                              {order.items.map((item) => (
                                <div key={item.$id} className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                                      {item.image ? (
                                        <div className="relative w-full h-full">
                                          <Image
                                            src={item.image}
                                            alt={item.productName}
                                            fill
                                            className="object-cover"
                                            sizes="40px"
                                          />
                                        </div>
                                      ) : (
                                        <ImageIcon size={16} className="text-gray-400" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                        {item.productName}
                                      </p>
                                      <p className="text-xs text-gray-600 dark:text-gray-400">
                                        Product ID: {item.productId} • Qty: {item.quantity}
                                      </p>
                                    </div>
                                  </div>
                                  <div className="text-right whitespace-nowrap">
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      ₹{item.totalPrice.toFixed(2)}
                                    </p>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                      ₹{item.price.toFixed(2)} each
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-8 bg-white dark:bg-gray-800 rounded-lg">
                              <Package className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                              <p className="text-gray-600 dark:text-gray-400">
                                No items found for this order
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Order Summary */}
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Order Summary</h4>
                          <div className="space-y-3 p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                              <span>₹{calculateSubtotal(order).toFixed(2)}</span>
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
                                <span className="text-green-600 dark:text-green-400">-₹{order.discountedAmount.toFixed(2)}</span>
                              </div>
                            )}
                            <Separator />
                            <div className="flex justify-between font-semibold">
                              <span className="text-gray-900 dark:text-white">Total:</span>
                              <span className="text-green-600 dark:text-green-400">₹{order.totalAmount.toFixed(2)}</span>
                            </div>
                          </div>

                          {/* Shipping Info */}
                          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-2">Shipping Details</h5>
                            {parsedAddress ? (
                              <>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {parsedAddress.house}, {parsedAddress.area}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {parsedAddress.addressLine}
                                </p>
                                {parsedAddress.landmark && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Near {parsedAddress.landmark}
                                  </p>
                                )}
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {parsedAddress.city}, {parsedAddress.state} - {parsedAddress.pincode}
                                </p>
                              </>
                            ) : (
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.address}
                              </p>
                            )}
                            <div className="mt-2 space-y-1">
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Phone: {order.customerPhone}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Email: {order.customerEmail}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Payment: {order.paymentMethod.toUpperCase()} • 
                                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                                  order.paymentStatus === 'paid' 
                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                                }`}>
                                  {order.paymentStatus}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">

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
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2 ml-auto"
                          asChild
                        >
                          <Link href={`/orders/${order.$id}`}>
                            <Eye size={16} />
                            View Full Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
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
                  <HelpCircle className="text-green-600 dark:text-green-400" size={24} />
                </div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Customer Support</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  24/7 support for order-related queries
                </p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="text-green-600 dark:text-green-400" size={24} />
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