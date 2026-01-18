"use client";

import { motion } from "framer-motion";
import { RefreshCw, XCircle, CheckCircle, Clock, AlertCircle } from "lucide-react";

export default function CancellationRefundPolicyPage() {
  const cancellationPoints = [
    {
      title: "Cancellation Before Shipping",
      icon: <XCircle className="w-5 h-5" />,
      details: "100% refund if cancelled before order is shipped",
      time: "Within 24 hours of order"
    },
    {
      title: "Cancellation After Shipping",
      icon: <AlertCircle className="w-5 h-5" />,
      details: "Refund minus shipping charges",
      time: "Contact customer support immediately"
    },
    {
      title: "Refund Processing",
      icon: <RefreshCw className="w-5 h-5" />,
      details: "Refunds processed within 7-10 business days",
      time: "To original payment method"
    }
  ];

  const refundScenarios = [
    {
      scenario: "Damaged Product",
      eligible: true,
      timeframe: "Within 48 hours of delivery",
      action: "Full refund or replacement"
    },
    {
      scenario: "Wrong Product",
      eligible: true,
      timeframe: "Within 48 hours of delivery",
      action: "Full refund or replacement"
    },
    {
      scenario: "Product Not as Described",
      eligible: true,
      timeframe: "Within 7 days of delivery",
      action: "Full refund or replacement"
    },
    {
      scenario: "Changed Mind",
      eligible: false,
      timeframe: "-",
      action: "Not eligible for refund"
    },
    {
      scenario: "Opened/Used Product",
      eligible: false,
      timeframe: "-",
      action: "Not eligible for refund"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Cancellation & Refund Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our transparent and customer-friendly cancellation and refund policy ensures 
              you shop with confidence and peace of mind.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Policy Summary */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {cancellationPoints.map((point, index) => (
              <motion.div
                key={point.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <div className="text-blue-600">
                      {point.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {point.title}
                  </h3>
                </div>
                <p className="text-gray-700 mb-2">{point.details}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span>{point.time}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Refund Eligibility */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Refund Eligibility Scenarios
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Scenario
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Eligible for Refund
                    </th>
                    <th className="px6 py-3 text-left text-sm font-semibold text-gray-900">
                      Timeframe
                    </th>
                    <th className="px6 py-3 text-left text-sm font-semibold text-gray-900">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {refundScenarios.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {item.scenario}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${item.eligible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.eligible ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {item.eligible ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.timeframe}
                      </td>
                      <td className="px6 py-4 text-sm text-gray-600">
                        {item.action}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-8">
            {/* Cancellation Policy */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Cancellation Policy Details
              </h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1. How to Cancel an Order
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Log into your account and visit 'My Orders'</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Click on 'Cancel Order' next to the order you wish to cancel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Select the reason for cancellation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-1">•</span>
                      <span>Submit the cancellation request</span>
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Cancellation Timeframe
                  </h3>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">✓</span>
                        <span><strong>Before Shipping:</strong> Orders can be cancelled anytime before shipping confirmation is sent</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-blue-500 mt-1">⚠</span>
                        <span><strong>After Shipping:</strong> Once shipped, you need to refuse delivery or return the product</span>
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3. Partial Cancellations
                  </h3>
                  <p className="text-gray-600">
                    Partial cancellations are allowed for orders with multiple items. 
                    You can cancel specific items from your order before shipping.
                  </p>
                </section>
              </div>
            </div>

            {/* Refund Policy */}
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Refund Policy Details
              </h2>
              
              <div className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    1. Refund Process
                  </h3>
                  <div className="grid md:grid-cols-4 gap-4">
                    {['Request', 'Inspection', 'Approval', 'Payment'].map((step, index) => (
                      <div key={step} className="text-center">
                        <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold mx-auto mb-2">
                          {index + 1}
                        </div>
                        <p className="text-sm font-medium text-gray-900">{step}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600">
                    Complete refund process takes 7-10 business days from approval.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    2. Refund Methods
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Credit/Debit Card', 'Net Banking', 'UPI', 'Wallet'].map((method) => (
                      <div key={method} className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-sm font-medium text-gray-900">{method}</p>
                      </div>
                    ))}
                  </div>
                  <p className="mt-4 text-gray-600">
                    Refunds are processed to the original payment method used during purchase.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    3. Non-Refundable Items
                  </h3>
                  <ul className="space-y-2 text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Personalized or custom-made products</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Digital products (e-books, guides, etc.)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Products damaged due to customer misuse</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-500 mt-1">•</span>
                      <span>Perishable goods</span>
                    </li>
                  </ul>
                </section>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Need Help with Cancellation or Refund?
              </h3>
              <p className="text-gray-600 mb-4">
                For assistance with cancellations, refund status, or any related queries, 
                please contact our customer support team.
              </p>
              <div className="flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email Support</p>
                  <a
                    href="mailto:refunds@yourstore.com"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    refunds@yourstore.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Support</p>
                  <a
                    href="tel:+911234567890"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    +91 1234567890
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Response Time</p>
                  <p className="text-gray-600">Within 24 hours</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}