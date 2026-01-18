"use client";

import { motion } from "framer-motion";
import { Shield, Lock, Eye, UserCheck, Mail, Database } from "lucide-react";

export default function PrivacyPolicyPage() {
  const dataCollectionPoints = [
    {
      icon: <UserCheck className="w-5 h-5" />,
      title: "Personal Information",
      items: ["Name", "Email", "Phone", "Address"]
    },
    {
      icon: <Database className="w-5 h-5" />,
      title: "Usage Data",
      items: ["Browsing History", "Device Information", "IP Address", "Cookies"]
    },
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Communication",
      items: ["Order Details", "Customer Support", "Feedback", "Preferences"]
    }
  ];

  const dataUsage = [
    {
      purpose: "Order Processing",
      description: "To process and deliver your orders"
    },
    {
      purpose: "Customer Support",
      description: "To respond to your queries and requests"
    },
    {
      purpose: "Personalization",
      description: "To provide personalized recommendations"
    },
    {
      purpose: "Marketing",
      description: "To send promotional offers (with consent)"
    },
    {
      purpose: "Improvement",
      description: "To improve our products and services"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-violet-50 py-12">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your privacy is important to us. This policy explains how we collect, 
              use, and protect your personal information.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Key Points */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: <Shield className="w-6 h-6" />,
                title: "Data Protection",
                description: "Your data is encrypted and securely stored"
              },
              {
                icon: <Lock className="w-6 h-6" />,
                title: "Secure Transactions",
                description: "All transactions are SSL encrypted"
              },
              {
                icon: <Eye className="w-6 h-6" />,
                title: "Transparency",
                description: "Clear information about data usage"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border p-6 text-center"
              >
                <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <div className="text-purple-600">
                    {item.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Data Collection */}
          <div className="bg-white rounded-xl shadow-sm border p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Information We Collect
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {dataCollectionPoints.map((item, index) => (
                <div key={item.title} className="text-center">
                  <div className="bg-purple-100 p-3 rounded-lg w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <div className="text-purple-600">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <ul className="space-y-1">
                    {item.items.map((listItem, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">
                        {listItem}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Policy */}
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-sm border p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Detailed Privacy Policy
              </h2>
              
              <div className="space-y-8">
                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    1. Information Collection
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We collect information that you provide directly to us, such as when you create an account, 
                      place an order, or contact customer support. This includes:
                    </p>
                    <ul className="space-y-2 pl-5">
                      <li className="list-disc">Contact information (name, email, phone number)</li>
                      <li className="list-disc">Shipping and billing addresses</li>
                      <li className="list-disc">Payment information (processed securely by payment gateways)</li>
                      <li className="list-disc">Communications with our customer support team</li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    2. Use of Information
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      We use the information we collect for various purposes:
                    </p>
                    <div className="bg-gray-50 rounded-lg p-4">
                      {dataUsage.map((item, index) => (
                        <div key={item.purpose} className="flex items-start gap-3 py-2">
                          <div className="bg-purple-100 text-purple-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-1">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{item.purpose}</p>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    3. Data Sharing and Disclosure
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We do not sell your personal information. We may share information with:
                    </p>
                    <ul className="space-y-2 pl-5">
                      <li className="list-disc">
                        <strong>Service Providers:</strong> Payment processors, shipping companies, and marketing platforms
                      </li>
                      <li className="list-disc">
                        <strong>Legal Requirements:</strong> When required by law or to protect our rights
                      </li>
                      <li className="list-disc">
                        <strong>Business Transfers:</strong> In connection with a merger or acquisition
                      </li>
                    </ul>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    4. Data Security
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We implement appropriate technical and organizational security measures to protect your 
                      personal information against unauthorized access, alteration, disclosure, or destruction.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {['SSL Encryption', 'Secure Servers', 'Regular Audits', 'Access Controls'].map((measure) => (
                        <div key={measure} className="bg-gray-50 p-3 rounded text-center">
                          <p className="text-sm font-medium text-gray-900">{measure}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    5. Your Rights
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      You have the right to:
                    </p>
                    <ul className="space-y-2 pl-5">
                      <li className="list-disc">Access your personal information</li>
                      <li className="list-disc">Correct inaccurate information</li>
                      <li className="list-disc">Delete your personal information</li>
                      <li className="list-disc">Object to processing of your information</li>
                      <li className="list-disc">Data portability</li>
                      <li className="list-disc">Withdraw consent at any time</li>
                    </ul>
                    <p>
                      To exercise these rights, please contact us using the information below.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    6. Cookies and Tracking
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We use cookies and similar tracking technologies to track activity on our website 
                      and hold certain information. You can instruct your browser to refuse all cookies 
                      or to indicate when a cookie is being sent.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    7. Children's Privacy
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      Our website is not intended for children under 13 years of age. We do not knowingly 
                      collect personal information from children under 13. If you are a parent or guardian 
                      and believe your child has provided us with personal information, please contact us.
                    </p>
                  </div>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    8. Changes to This Policy
                  </h3>
                  <div className="space-y-4 text-gray-600">
                    <p>
                      We may update our Privacy Policy from time to time. We will notify you of any changes 
                      by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                    </p>
                    <div className="bg-purple-50 border border-purple-100 rounded-lg p-4">
                      <p className="text-purple-800 font-medium">
                        Last Updated: January 18, 2024
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Contact Section */}
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Us for Privacy Concerns
              </h3>
              <p className="text-gray-600 mb-4">
                If you have any questions or concerns about this Privacy Policy or our data practices, 
                please contact our Data Protection Officer.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Data Protection Officer</p>
                  <p className="text-gray-900 font-medium">Privacy Team</p>
                  <a
                    href="mailto:privacy@yourstore.com"
                    className="text-purple-600 hover:text-purple-700 text-sm"
                  >
                    privacy@yourstore.com
                  </a>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Mailing Address</p>
                  <p className="text-gray-600 text-sm">
                    Your Store Name<br />
                    Privacy Department<br />
                    123 Business Street<br />
                    City, State 123456
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}