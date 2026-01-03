// lib/pdf-generator.ts
import jsPDF from 'jspdf';
import { format } from 'date-fns';
import type { InvoiceData } from './invoice-service';

export async function generatePDFWithJsPDF(invoiceData: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  
  // Set document properties
  doc.setProperties({
    title: `Invoice - ${invoiceData.orderNumber}`,
    subject: 'Invoice',
    author: 'Your Store Name',
    keywords: 'invoice, order, receipt',
    creator: 'Your Store'
  });

  // Add logo (optional)
  // doc.addImage(logoData, 'PNG', 10, 10, 50, 20);

  // Store name and address
  doc.setFontSize(20);
  doc.setTextColor(0, 102, 0); // Green color
  doc.text('Your Store Name', 105, 20, { align: 'center' });
  
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0); // Black color
  doc.text('123 Business Street', 105, 28, { align: 'center' });
  doc.text('City, State - 123456', 105, 32, { align: 'center' });
  doc.text('Phone: +91 1234567890 | Email: support@yourstore.com', 105, 36, { align: 'center' });
  doc.text('GSTIN: 12ABCDE1234F1Z5', 105, 40, { align: 'center' });

  // Invoice title
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text('TAX INVOICE', 105, 50, { align: 'center' });

  // Invoice details
  doc.setFontSize(10);
  let yPos = 60;
  
  // Left column - Invoice details
  doc.text(`Invoice Number: ${invoiceData.orderNumber}`, 20, yPos);
  doc.text(`Invoice Date: ${format(new Date(invoiceData.orderDate), 'dd/MM/yyyy')}`, 20, yPos + 5);
  doc.text(`Order Date: ${format(new Date(invoiceData.orderDate), 'dd/MM/yyyy')}`, 20, yPos + 10);
  
  // Right column - Customer details
  doc.text(`Customer Name: ${invoiceData.customerName}`, 120, yPos);
  doc.text(`Phone: ${invoiceData.customerPhone}`, 120, yPos + 5);
  doc.text(`Email: ${invoiceData.customerEmail}`, 120, yPos + 10);
  
  // Shipping address
  yPos += 20;
  doc.setFontSize(11);
  doc.text('Shipping Address:', 20, yPos);
  doc.setFontSize(10);
  doc.text(invoiceData.shippingAddress.house, 20, yPos + 5);
  doc.text(invoiceData.shippingAddress.addressLine, 20, yPos + 10);
  doc.text(`${invoiceData.shippingAddress.city}, ${invoiceData.shippingAddress.state} - ${invoiceData.shippingAddress.pincode}`, 20, yPos + 15);

  // Table header
  yPos += 30;
  doc.setFillColor(240, 240, 240);
  doc.rect(20, yPos, 170, 8, 'F');
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  
  doc.text('S.No.', 22, yPos + 6);
  doc.text('Product Name', 35, yPos + 6);
  doc.text('Price', 120, yPos + 6);
  doc.text('Qty', 140, yPos + 6);
  doc.text('Total', 160, yPos + 6);
  
  // Table rows
  doc.setFont(undefined, 'normal');
  yPos += 8;
  
  invoiceData.items.forEach((item, index) => {
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
    
    doc.text((index + 1).toString(), 22, yPos + 6);
    doc.text(item.name, 35, yPos + 6);
    doc.text(`₹${item.price.toFixed(2)}`, 120, yPos + 6);
    doc.text(item.quantity.toString(), 140, yPos + 6);
    doc.text(`₹${item.total.toFixed(2)}`, 160, yPos + 6);
    
    yPos += 8;
  });

  // Summary
  yPos += 10;
  doc.setFont(undefined, 'bold');
  doc.text('Subtotal:', 120, yPos + 6);
  doc.text(`₹${invoiceData.subtotal.toFixed(2)}`, 160, yPos + 6);
  
  yPos += 8;
  doc.text('Shipping:', 120, yPos + 6);
  doc.text(`₹${invoiceData.shippingCost.toFixed(2)}`, 160, yPos + 6);
  
  yPos += 8;
  doc.text('Tax:', 120, yPos + 6);
  doc.text(`₹${invoiceData.taxAmount.toFixed(2)}`, 160, yPos + 6);
  
  if (invoiceData.discountAmount > 0) {
    yPos += 8;
    doc.text('Discount:', 120, yPos + 6);
    doc.text(`-₹${invoiceData.discountAmount.toFixed(2)}`, 160, yPos + 6);
  }
  
  yPos += 8;
  doc.setFontSize(11);
  doc.setTextColor(0, 102, 0); // Green color
  doc.text('Total:', 120, yPos + 6);
  doc.text(`₹${invoiceData.totalAmount.toFixed(2)}`, 160, yPos + 6);
  
  // Payment information
  yPos += 15;
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`Payment Method: ${invoiceData.paymentMethod.toUpperCase()}`, 20, yPos);
  doc.text(`Payment Status: ${invoiceData.paymentStatus}`, 20, yPos + 5);
  
  // Footer
  yPos += 20;
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('Thank you for your business!', 105, yPos, { align: 'center' });
  doc.text('This is a computer-generated invoice and does not require a signature.', 105, yPos + 5, { align: 'center' });
  doc.text('For any queries, contact: support@yourstore.com | +91 1234567890', 105, yPos + 10, { align: 'center' });

  // Generate PDF blob
  const pdfBlob = doc.output('blob');
  return pdfBlob;
}