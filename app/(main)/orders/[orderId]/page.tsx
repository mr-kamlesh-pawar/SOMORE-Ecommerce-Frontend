// app/orders/[orderId]/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/store/context/AuthContext';
import { 
  getOrderWithItems,
  parseShippingAddress,
  type Order,
  type OrderItem 
} from '@/lib/order-service';
import { 
  ArrowLeft,
  Package, 
  Calendar, 
  IndianRupee, 
  Truck, 
  CheckCircle, 
  Clock, 
  RefreshCw, 
  AlertCircle,
  Download,
  Printer,
  Mail,
  MapPin,
  Phone,
  CreditCard,
  FileText,
  User,
  Home,
  ChevronRight,
  Share2,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { generateInvoice } from '@/lib/invoice-service';

// Order status timeline steps
const orderStatusSteps = [
  { key: 'pending', label: 'Order Placed', icon: Clock },
  { key: 'confirmed', label: 'Order Confirmed', icon: CheckCircle },
  { key: 'processing', label: 'Processing', icon: RefreshCw },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Add loading state for invoice
const [downloadingInvoice, setDownloadingInvoice] = useState(false);

  const orderId = params.orderId as string;

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        router.push('/login?redirect=/orders');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const data = await getOrderWithItems(orderId);
        
        if (!data.order) {
          setError('Order not found');
          return;
        }

        // Check if order belongs to current user
        if (data.order.userId !== user.$id) {
          setError('Unauthorized access');
          return;
        }

        setOrder(data.order);
        setItems(data.items);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setError('Failed to load order details');
      } finally {
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, user, router]);

  // Format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'EEEE, MMMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return format(new Date(dateString), 'hh:mm a');
    } catch {
      return '';
    }
  };

  // Calculate subtotal
  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.totalPrice, 0);
  };

  // Parse shipping address
  const parsedAddress = order?.shippingAddress ? parseShippingAddress(order.shippingAddress) : null;



// Download invoice function
const handleDownloadInvoice = async () => {
  if (!order) return;
  
  try {
    setDownloadingInvoice(true);
    
    // Generate PDF
    const pdfBlob = await generateInvoice(order.$id);
    
    // Create download link
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice-${order.orderNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
    
    // Optional: Show success message
    // toast.success('Invoice downloaded successfully!');
    
  } catch (error) {
    console.error('Error downloading invoice:', error);
    // toast.error('Failed to download invoice');
  } finally {
    setDownloadingInvoice(false);
  }
};

  // Get current status index
  const getCurrentStatusIndex = () => {
    if (!order) return 0;
    return orderStatusSteps.findIndex(step => step.key === order.orderStatus);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Please login to view order details
          </h2>
          <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
            <Link href="/login?redirect=/orders">
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            {/* Header skeleton */}
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-8 w-48" />
            </div>
            
            {/* Main content skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-64 w-full rounded-xl" />
                <Skeleton className="h-96 w-full rounded-xl" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 w-full rounded-xl" />
                <Skeleton className="h-64 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-16 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {error || 'Order not found'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
            {error === 'Order not found' 
              ? 'The order you are looking for does not exist or has been deleted.'
              : 'There was an error loading the order details.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="outline">
              <Link href="/orders">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </Link>
            </Button>
            <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
              <Link href="/products">
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getCurrentStatusIndex();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                asChild
              >
                <Link href="/orders">
                  <ArrowLeft size={20} />
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order Details
                </h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  #{order.orderNumber} • Placed on {formatDate(order.$createdAt)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Share2 size={16} />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Printer size={16} />
                Print
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <Download size={16} />
                Invoice
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Status
                </h2>
                <OrderStatusBadge status={order.orderStatus} />
              </div>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-gray-200 dark:bg-gray-700"></div>
                <div 
                  className="absolute left-0 top-4 h-0.5 bg-green-500 transition-all duration-500"
                  style={{ width: `${(currentStatusIndex / (orderStatusSteps.length - 1)) * 100}%` }}
                ></div>
                
                {/* Timeline steps */}
                <div className="relative flex justify-between">
                  {orderStatusSteps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;
                    
                    return (
                      <div key={step.key} className="flex flex-col items-center relative z-10">
                        <div className={`
                          w-8 h-8 rounded-full flex items-center justify-center mb-2
                          ${isCompleted 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                          }
                          ${isCurrent ? 'ring-4 ring-green-100 dark:ring-green-900' : ''}
                          transition-all duration-300
                        `}>
                          <StepIcon size={16} />
                        </div>
                        <span className={`
                          text-xs font-medium text-center
                          ${isCompleted 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-500 dark:text-gray-400'
                          }
                        `}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status details */}
              <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-100 dark:border-green-800">
                <div className="flex items-center gap-3">
                  <Package className="text-green-600 dark:text-green-400" size={20} />
                  <div>
                    <p className="font-medium text-green-800 dark:text-green-300">
                      {order.orderStatus === 'pending' && 'Your order has been placed successfully.'}
                      {order.orderStatus === 'confirmed' && 'Your order has been confirmed.'}
                      {order.orderStatus === 'processing' && 'We are processing your order.'}
                      {order.orderStatus === 'shipped' && 'Your order has been shipped!'}
                      {order.orderStatus === 'delivered' && 'Your order has been delivered.'}
                    </p>
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Last updated: {formatDate(order.$updatedAt)} at {formatTime(order.$updatedAt)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Order Items ({items.length})
                </h2>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {items.map((item, index) => (
                  <div key={item.$id} className="p-6">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-900 rounded-lg flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image}
                              alt={item.productName}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="text-gray-400" size={24} />
                          )}
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="font-medium text-gray-900 dark:text-white">
                              {item.productName}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                SKU: {item.productId.slice(0, 8)}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Qty: {item.quantity}
                              </Badge>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900 dark:text-white">
                              ₹{item.totalPrice.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              ₹{item.price.toFixed(2)} each
                            </p>
                          </div>
                        </div>
                        
                        {/* Actions */}
                        <div className="flex items-center gap-4 mt-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                            asChild
                          >
                            <Link href={`/products/${item.productId}`}>
                              View Product
                            </Link>
                          </Button>
                          {order.orderStatus === 'delivered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                            >
                              <Star className="mr-1 h-3 w-3" />
                              Rate Product
                            </Button>
                          )}
                          {order.orderStatus === 'delivered' && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300"
                            >
                              <RefreshCw className="mr-1 h-3 w-3" />
                              Buy Again
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Information */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Delivery Information
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Address */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="text-gray-500 dark:text-gray-400" size={20} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Shipping Address
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    {parsedAddress ? (
                      <>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {parsedAddress.house}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {parsedAddress.area}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {parsedAddress.addressLine}
                        </p>
                        {parsedAddress.landmark && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Landmark: {parsedAddress.landmark}
                          </p>
                        )}
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          {parsedAddress.city}, {parsedAddress.state} - {parsedAddress.pincode}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Phone size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {parsedAddress.mobileno}
                          </span>
                        </div>
                      </>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-400">{order.address}</p>
                    )}
                  </div>
                </div>

                {/* Customer Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="text-gray-500 dark:text-gray-400" size={20} />
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      Customer Information
                    </h3>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 space-y-3">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Full Name</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Email Address</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customerEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Phone Number</p>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {order.customerPhone}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary & Actions */}
          <div className="space-y-8">
            {/* Order Summary */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal ({items.length} items)</span>
                  <span>₹{calculateSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Shipping</span>
                  <span>₹{order.shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tax</span>
                  <span>₹{order.taxAmount.toFixed(2)}</span>
                </div>
                {order.discountedAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Discount</span>
                    <span className="text-green-600 dark:text-green-400">
                      -₹{order.discountedAmount.toFixed(2)}
                    </span>
                  </div>
                )}
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span className="text-gray-900 dark:text-white">Total Amount</span>
                  <span className="text-green-600 dark:text-green-400">
                    ₹{order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Payment Information */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-3">
                  <CreditCard className="text-gray-500 dark:text-gray-400" size={18} />
                  <h3 className="font-medium text-gray-900 dark:text-white">Payment Information</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Method</span>
                    <span className="font-medium">{order.paymentMethod.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Payment Status</span>
                  <Badge variant={order.paymentStatus === 'paid' ? 'default' : 'destructive'}>
  {order.paymentStatus}
</Badge>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Order Date</span>
                    <span>{formatDate(order.$createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Order Actions
              </h3>
              
              <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                size="sm"
                onClick={handleDownloadInvoice}
                disabled={downloadingInvoice}
                >
                <FileText className="mr-2 h-4 w-4" />
                {downloadingInvoice ? 'Generating...' : 'Download Invoice'}
                </Button>
                
                {order.orderStatus === 'delivered' && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Return Items
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      size="sm"
                    >
                      <Star className="mr-2 h-4 w-4" />
                      Rate Products
                    </Button>
                  </>
                )}
                
                {order.orderStatus === 'shipped' && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    size="sm"
                  >
                    <Truck className="mr-2 h-4 w-4" />
                    Track Shipment
                  </Button>
                )}
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  size="sm"
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </div>

              {/* Help Section */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                  Need Help?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  Our customer support team is here to help you.
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <Phone className="mr-2 h-3 w-3" />
                  Call Support: 1800-123-4567
                </Button>
              </div>
            </div>

            {/* Related Actions */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-xl border border-green-200 dark:border-gray-700 p-6">
              <h3 className="font-medium text-gray-900 dark:text-white mb-4">
                Related Actions
              </h3>
              <div className="space-y-3">
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  asChild
                >
                  <Link href="/products">
                    Continue Shopping
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  asChild
                >
                  <Link href="/orders">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Orders
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Notes */}
        {order.notes && (
          <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800 p-6">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="text-yellow-600 dark:text-yellow-400" size={18} />
              <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                Order Notes
              </h3>
            </div>
            <p className="text-yellow-700 dark:text-yellow-400">
              {order.notes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}