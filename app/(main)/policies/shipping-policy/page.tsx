"use client";

import { motion } from "framer-motion";
import { Truck, Package, Clock, Shield } from "lucide-react";

export default function ShippingPolicyPage() {
  const policies = [
    {
      title: "Shipping Areas",
      icon: <Truck className="w-6 h-6" />,
      items: [
        "We ship across all states in India",
        "Free shipping on orders above ₹999",
        "International shipping available (charges apply)",
      ]
    },
    {
      title: "Delivery Time",
      icon: <Clock className="w-6 h-6" />,
      items: [
        "Metro cities: 3-5 business days",
        "Tier 2 cities: 5-7 business days",
        "Remote areas: 7-10 business days",
        "Express delivery available (24-48 hours)",
      ]
    },
    {
      title: "Shipping Charges",
      icon: <Package className="w-6 h-6" />,
      items: [
        "Orders below ₹999: ₹49 shipping fee",
        "Orders above ₹999: Free shipping",
        "International orders: Calculated at checkout",
        "Express delivery: Additional ₹99",
      ]
    },
    {
      title: "Order Tracking",
      icon: <Shield className="w-6 h-6" />,
      items: [
        "Real-time tracking via SMS & Email",
        "24/7 order tracking portal",
        "Delivery updates via WhatsApp",
        "Customer support for tracking issues",
      ]
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Order Processing",
      description: "Orders are processed within 24 hours of confirmation"
    },
    {
      step: "2",
      title: "Shipping",
      description: "Products are shipped via trusted courier partners"
    },
    {
      step: "3",
      title: "In Transit",
      description: "Real-time tracking available via email/SMS"
    },
    {
      step: "4",
      title: "Delivery",
      description: "Safe delivery with contactless options available"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Shipping Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Fast, reliable, and transparent shipping for all your herbal product needs.
              We ensure your orders reach you safely and on time.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Policy Highlights */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {policies.map((policy, index) => (
              <motion.div
                key={policy.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="text-green-600">
                      {policy.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {policy.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {policy.items.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600">
                      <span className="text-green-500 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Shipping Process */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Our Shipping Process
            </h2>
            <div className="grid md:grid-cols-4 gap-6">
              {processSteps.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Shipping Information
              </h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1. Order Processing Time
                  </h3>
                  <p className="text-gray-600">
                    All orders are processed within 24-48 hours after receiving order confirmation. 
                    Orders placed on weekends or public holidays will be processed on the next business day.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Delivery Partners
                  </h3>
                  <p className="text-gray-600">
                    We partner with reputed courier services including Delhivery, DTDC, Blue Dart, 
                    and India Post to ensure reliable delivery across India. For international shipments, 
                    we use DHL and FedEx.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3. International Shipping
                  </h3>
                  <p className="text-gray-600">
                    We ship to select countries internationally. Shipping charges vary based on destination 
                    and are calculated at checkout. Delivery time for international orders is 7-15 business days.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    4. Delivery Issues
                  </h3>
                  <p className="text-gray-600">
                    In case of delivery issues, damaged products, or wrong items delivered, 
                    please contact our customer support within 48 hours of delivery. We will 
                    arrange for replacement or refund as per our return policy.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    5. Shipping Restrictions
                  </h3>
                  <p className="text-gray-600">
                    Certain herbal products may have shipping restrictions to specific regions 
                    due to local regulations. We will notify you if any restrictions apply to your order.
                  </p>
                </section>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-green-50 border border-green-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help with Shipping?
              </h3>
              <p className="text-gray-600 mb-4">
                For any shipping-related queries, delivery status updates, or special shipping requests, 
                please contact our customer support team.
              </p>
              <div className="flex flex-wrap gap-4">
                <a
                  href="mailto:shipping@yourstore.com"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <span>📧</span>
                  shipping@yourstore.com
                </a>
                <a
                  href="tel:+911234567890"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700"
                >
                  <span>📞</span>
                  +91 1234567890
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}