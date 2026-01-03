// lib/invoice-service.ts
import { getOrderWithItems } from './order-service';
import { parseShippingAddress } from './order-service';
import { generatePDFWithJsPDF } from './pdf-generator';

export interface InvoiceData {
  orderNumber: string;
  orderDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: any;
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  subtotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: string;
  paymentStatus: string;
}

export async function generateInvoice(orderId: string): Promise<Blob> {
  try {
    // Fetch order data
    const { order, items } = await getOrderWithItems(orderId);
    
    if (!order) {
      throw new Error('Order not found');
    }

    // Prepare invoice data
    const invoiceData: InvoiceData = {
      orderNumber: order.orderNumber,
      orderDate: order.$createdAt,
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      shippingAddress: parseShippingAddress(order.shippingAddress),
      items: items.map(item => ({
        name: item.productName,
        price: item.price,
        quantity: item.quantity,
        total: item.totalPrice
      })),
      subtotal: items.reduce((sum, item) => sum + item.totalPrice, 0),
      shippingCost: order.shippingCost,
      taxAmount: order.taxAmount,
      discountAmount: order.discountedAmount,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus
    };

    // Generate PDF invoice using jsPDF
    const pdfBlob = await generatePDF(invoiceData);
    return pdfBlob;

  } catch (error) {
    console.error('Error generating invoice:', error);
    throw error;
  }
}

async function generatePDF(invoiceData: InvoiceData): Promise<Blob> {
  // Method 1: Using jsPDF (requires installation)
  return await generatePDFWithJsPDF(invoiceData);
  
  // Method 2: Using html2pdf (alternative)
  // return await generatePDFWithHtml2Pdf(invoiceData);
}