"use client";

import CartItemsDetails from "@/components/carts/CartItemsDetails";
import OrderSummaryForCart from "@/components/carts/OrderSummaryForCart";
import { Separator } from "@/components/ui/separator";

const CartPageOne = () => {
  return (
    <section className="px-4 py-4 lg:px-16 dark:bg-gray-800 min-h-screen bg-gray-50">

   
          <div className="max-w-screen-xl mx-auto">
            {/* Breadcrumb Navigation */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm">
                <li>
                  <a href="/" className="text-gray-500 hover:text-gray-700">Home</a>
                </li>
                <li className="text-gray-400">›</li>
              
                
                <li className="text-gray-900 font-medium">Cart</li>
              </ol>
            </nav>
    
            <div className="mb-6">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-2">
               Shopping Cart
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  Cart
                </span>
                <span className="text-gray-400">→</span>
                
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  Address
                </span>
                <span className="text-gray-400">→</span>
    
    
                <span className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  Checkout
                </span>
    
    
                <span className="text-gray-400">→</span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                  Success
                </span>
              </div>
              <Separator className="dark:bg-white/50 mt-4" />
            </div>



      
    

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        
      

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
              <CartItemsDetails />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
                <OrderSummaryForCart />
              </div>
            </div>
          </div>

        </div>
      </div>

      </div>
    </section>
  );
};

export default CartPageOne;
