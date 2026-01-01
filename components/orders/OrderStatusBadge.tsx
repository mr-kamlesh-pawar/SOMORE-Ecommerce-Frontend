// components/orders/OrderStatusBadge.tsx
import React from 'react';
import { CheckCircle, Truck, RefreshCw, Clock, AlertCircle } from 'lucide-react';

interface OrderStatusBadgeProps {
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pending',
      color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      icon: <Clock size={14} />
    },
    confirmed: {
      label: 'Confirmed',
      color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      icon: <CheckCircle size={14} />
    },
    processing: {
      label: 'Processing',
      color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      icon: <RefreshCw size={14} />
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      icon: <Truck size={14} />
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      icon: <CheckCircle size={14} />
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      icon: <AlertCircle size={14} />
    }
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
      {config.icon}
      {config.label}
    </span>
  );
};

export default OrderStatusBadge;