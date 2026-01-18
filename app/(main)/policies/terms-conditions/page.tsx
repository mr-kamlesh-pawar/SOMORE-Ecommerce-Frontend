"use client";

import { motion } from "framer-motion";
import { FileText, ShoppingBag, CreditCard, Truck, Shield, User } from "lucide-react";

export default function TermsConditionsPage() {
  const keySections = [
    {
      icon: <ShoppingBag className="w-5 h-5" />,
      title: "Product Information",
      points: ["Accurate descriptions", "Pricing details", "Availability"]
    },
    {
      icon: <CreditCard className="w-5 h-5" />,
      title: "Payment Terms",
      points: ["Accepted methods", "Security", "Processing"]
    },
    {
      icon: <Truck className="w-5 h-5" />,
      title: "Delivery Policy",
      points: ["Shipping areas", "Timeframes", "Charges"]
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Returns & Refunds",
      points: ["Eligibility", "Process", "Timeframe"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-50 to-amber-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-orange-600" />
              <h1 className="text-4xl font-bold text-gray-900">
                Terms & Conditions
              </h1>
            </div>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Please read these terms carefully before using our website or purchasing our products.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Key Sections Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {keySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <div className="text-orange-600">
                      {section.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {section.points.map((point, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-600 text-sm">
                      <span className="text-orange-500 mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Detailed Terms */}
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Complete Terms & Conditions
            </h2>
            
            <div className="space-y-10">
              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  1. Acceptance of Terms
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    By accessing and using this website, you accept and agree to be bound by the terms 
                    and provision of this agreement. Additionally, when using this website's particular 
                    services, you shall be subject to any posted guidelines or rules applicable to such services.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  2. Account Registration
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    To access certain features of the website, you may be required to register for an account. 
                    You agree to provide accurate, current, and complete information during the registration 
                    process and to update such information to keep it accurate, current, and complete.
                  </p>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                    <p className="text-orange-800 font-medium">
                      You are responsible for safeguarding your password and for all activities that occur 
                      under your account.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  3. Product Information
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We strive to ensure that all product information, including descriptions, images, 
                    and specifications, is accurate. However, we do not warrant that product descriptions 
                    or other content is accurate, complete, reliable, current, or error-free.
                  </p>
                  <ul className="space-y-2 pl-5">
                    <li className="list-disc">Prices are subject to change without notice</li>
                    <li className="list-disc">Product availability may vary</li>
                    <li className="list-disc">Colors may appear differently on different screens</li>
                    <li className="list-disc">We reserve the right to discontinue products</li>
                  </ul>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  4. Orders and Payment
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    All orders are subject to acceptance and availability. We reserve the right to refuse 
                    or cancel any order for any reason at any time.
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Accepted Payment Methods</h4>
                      <ul className="space-y-1">
                        {['Credit/Debit Cards', 'Net Banking', 'UPI', 'Wallet', 'Cash on Delivery'].map((method) => (
                          <li key={method} className="text-gray-600 text-sm">• {method}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Payment Security</h4>
                      <p className="text-gray-600 text-sm">
                        All payments are processed through secure payment gateways. We do not store 
                        your payment information on our servers.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  5. Shipping and Delivery
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Shipping costs and delivery times may vary based on your location and the shipping 
                    method selected. We are not responsible for delays caused by customs, weather, 
                    or other factors beyond our control.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-medium text-gray-900">Delivery Responsibilities:</p>
                    <ul className="mt-2 space-y-2">
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Ensure someone is available to receive the delivery</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Inspect packages for damage before accepting</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm">
                        <span className="text-orange-500 mt-1">•</span>
                        <span>Report any issues within 48 hours of delivery</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  6. Returns and Refunds
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    Please refer to our separate <a href="/policies/cancellation-refund" className="text-orange-600 hover:underline">Cancellation & Refund Policy</a> 
                    for detailed information about returns and refunds.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  7. Intellectual Property
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    All content on this website, including text, graphics, logos, images, and software, 
                    is the property of our company or its content suppliers and is protected by 
                    copyright and other intellectual property laws.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  8. Limitation of Liability
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    To the maximum extent permitted by law, we shall not be liable for any indirect, 
                    incidental, special, consequential, or punitive damages resulting from your use 
                    of or inability to use the website or products.
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  9. Governing Law
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    These terms shall be governed by and construed in accordance with the laws of India. 
                    Any disputes shall be subject to the exclusive jurisdiction of the courts in [Your City].
                  </p>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  10. Changes to Terms
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    We reserve the right to modify these terms at any time. We will notify users of any 
                    material changes by posting the new terms on this page and updating the "Last Updated" date.
                  </p>
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-4">
                    <p className="text-orange-800 font-medium">
                      Last Updated: January 18, 2024
                    </p>
                    <p className="text-orange-700 text-sm mt-1">
                      It is your responsibility to review these terms periodically for changes.
                    </p>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  11. Contact Information
                </h3>
                <div className="space-y-4 text-gray-600">
                  <p>
                    For any questions about these Terms & Conditions, please contact us:
                  </p>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Email</p>
                      <a href="mailto:legal@yourstore.com" className="text-orange-600 hover:underline">
                        legal@yourstore.com
                      </a>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 mb-1">Phone</p>
                      <a href="tel:+911234567890" className="text-orange-600 hover:underline">
                        +91 1234567890
                      </a>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Acceptance Section */}
          <div className="mt-8 text-center">
            <div className="inline-block bg-orange-50 border border-orange-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Acknowledgement
              </h3>
              <p className="text-gray-600 mb-4">
                By using our website or purchasing our products, you acknowledge that you have read, 
                understood, and agree to be bound by these Terms & Conditions.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>Updated for customer clarity and legal compliance</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}