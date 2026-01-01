// lib/order-service.ts
import { databases, } from "@/lib/appwrite";
import { ID, Query } from "appwrite";

const DB_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID!;
const ORDERS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDERS_COLLECTION_ID!;
const ORDER_ITEMS_COLLECTION_ID = process.env.NEXT_PUBLIC_APPWRITE_ORDER_ITEMS_COLLECTION_ID!;

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId: string;
}

interface ShippingAddress {
  house: string;
  area: string;
  addressLine: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  mobileno: string;
  addressType: string;
}

interface OrderData {
  userId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  address: string; // For quick display
  paymentMethod: string;
  cartItems: CartItem[];
  shippingCost: number;
  taxAmount: number;
  discountedAmount?: number;
  totalAmount: number;
  notes?: string;
}

// Generate order number
function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `ORD-${year}${month}${day}-${random}`;
}

// Create order based on your schema
export async function createOrder(orderData: OrderData) {
  try {
    const orderNumber = generateOrderNumber();
    
    // Format address for quick display
    const addressDisplay = `${orderData.shippingAddress.house}, ${orderData.shippingAddress.area}, ${orderData.shippingAddress.city} - ${orderData.shippingAddress.pincode}`;
    
    // 1. Create order document
    const orderDoc = await databases.createDocument(
      DB_ID,
      ORDERS_COLLECTION_ID,
      ID.unique(),
      {
        orderNumber,
        userId: orderData.userId,
        customerName: orderData.customerName,
        customerEmail: orderData.customerEmail,
        customerPhone: orderData.customerPhone,
        shippingAddress: JSON.stringify(orderData.shippingAddress), // Store as JSON string
        address: addressDisplay, // Store display address
        paymentMethod: orderData.paymentMethod,
        shippingCost: orderData.shippingCost,
        taxAmount: orderData.taxAmount || 0,
        discountedAmount: orderData.discountedAmount || 0,
        totalAmount: orderData.totalAmount,
        orderStatus: 'pending',
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
        notes: orderData.notes || '',
      }
    );

    // 2. Create order items
   const orderItemsPromises = orderData.cartItems.map(item => 
  databases.createDocument(
    DB_ID,
    ORDER_ITEMS_COLLECTION_ID,
    ID.unique(),
    {
      orderId: [orderDoc.$id], // Wrap in array for relationship
      productId: item.productId,
      productName: item.name,
      price: item.price,
      quantity: item.quantity,
      totalPrice: item.price * item.quantity,
    }
  )
);

    await Promise.all(orderItemsPromises);

    return {
      success: true,
      orderId: orderDoc.$id,
      orderNumber: orderDoc.orderNumber,
      message: 'Order created successfully'
    };

  } catch (error: any) {
    console.error('Error creating order:', error);
    return {
      success: false,
      error: error.message || 'Failed to create order'
    };
  }
}

// Get user orders
export async function getUserOrders(userId: string) {
  try {
    const orders = await databases.listDocuments(
      DB_ID,
      ORDERS_COLLECTION_ID,
      [
        Query.equal('userId', userId),
        Query.orderDesc('$createdAt'),
        Query.limit(50)
      ]
    );

    // Parse shipping address for each order
    const parsedOrders = orders.documents.map(order => ({
      ...order,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null
    }));

    return parsedOrders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Get order by ID
export async function getOrderById(orderId: string) {
  try {
    const order = await databases.getDocument(
      DB_ID,
      ORDERS_COLLECTION_ID,
      orderId
    );

    // Get order items
    const orderItems = await databases.listDocuments(
      DB_ID,
      ORDER_ITEMS_COLLECTION_ID,
      [Query.equal('orderId', orderId)]
    );

    return {
      ...order,
      items: orderItems.documents,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Get order by order number
export async function getOrderByNumber(orderNumber: string) {
  try {
    const orders = await databases.listDocuments(
      DB_ID,
      ORDERS_COLLECTION_ID,
      [Query.equal('orderNumber', orderNumber)]
    );

    if (orders.documents.length === 0) return null;

    const order = orders.documents[0];
    
    // Get order items
    const orderItems = await databases.listDocuments(
      DB_ID,
      ORDER_ITEMS_COLLECTION_ID,
      [Query.equal('orderId', order.$id)]
    );

    return {
      ...order,
      items: orderItems.documents,
      shippingAddress: order.shippingAddress ? JSON.parse(order.shippingAddress) : null
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
}

// Update order status
export async function updateOrderStatus(orderId: string, status: string) {
  try {
    await databases.updateDocument(
      DB_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      { orderStatus: status }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating order status:', error);
    return { success: false, error: 'Failed to update order status' };
  }
}

// Update payment status
export async function updatePaymentStatus(orderId: string, status: string) {
  try {
    await databases.updateDocument(
      DB_ID,
      ORDERS_COLLECTION_ID,
      orderId,
      { paymentStatus: status }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Error updating payment status:', error);
    return { success: false, error: 'Failed to update payment status' };
  }
}