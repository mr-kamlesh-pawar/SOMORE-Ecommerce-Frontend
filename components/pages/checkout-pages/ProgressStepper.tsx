// components/checkout/ProgressStepper.tsx
"use client";

import { ShoppingCart, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { usePathname } from "next/navigation";

const steps = [
  { 
    id: "cart", 
    name: "Cart", 
    path: "/cart", 
    icon: ShoppingCart 
  },
  { 
    id: "address", 
    name: "Shipping", 
    path: "/checkout/address", 
    icon: MapPin 
  },
  { 
    id: "checkout", 
    name: "Payment", 
    path: "/checkout", 
    icon: CreditCard 
  },
  { 
    id: "complete", 
    name: "Complete", 
    path: "/success", 
    icon: CheckCircle 
  },
];

interface ProgressStepperProps {
  currentStep: string;
}

const ProgressStepper = ({ currentStep }: ProgressStepperProps) => {
  const pathname = usePathname();
  const currentIndex = steps.findIndex(step => step.id === currentStep);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-2">
      {/* Desktop View */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-gray-200">
            <div 
              className="absolute top-0 left-0 h-full bg-green-600 transition-all duration-500"
              style={{ 
                width: `${(currentIndex / (steps.length - 1)) * 100}%` 
              }}
            ></div>
          </div>

          {/* Steps */}
          <div className="flex justify-between">
            {steps.map((step, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = index === currentIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center relative z-10">
                  {/* Step Circle */}
                  <div className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    transition-all duration-300
                    ${isCompleted 
                      ? "bg-green-600 text-white" 
                      : isCurrent 
                      ? "bg-white text-green-600 border-2 border-green-600" 
                      : "bg-gray-100 text-gray-400"
                    }
                  `}>
                    <step.icon size={18} />
                  </div>
                  
                  {/* Step Label */}
                  <span className={`
                    mt-3 text-sm font-medium
                    ${isCompleted || isCurrent 
                      ? "text-green-600" 
                      : "text-gray-400"
                    }
                  `}>
                    {step.name}
                  </span>
                  
                  {/* Step Number */}
                  <span className="text-xs text-gray-500 mt-1">
                    Step {index + 1}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentIndex >= 0 ? "bg-green-600 text-white" : "bg-gray-100 text-gray-400"}
              `}>
                <ShoppingCart size={14} />
              </div>
              <div className="text-xs">
                <p className={currentIndex >= 0 ? "text-green-600 font-medium" : "text-gray-400"}>
                  Step {currentIndex + 1} of {steps.length}
                </p>
                <p className="text-xs text-gray-500">
                  {steps[currentIndex]?.name || "Cart"}
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-xs text-gray-500">Progress</p>
            <p className="text-sm font-medium">
              {Math.round((currentIndex / steps.length) * 100)}%
            </p>
          </div>
        </div>
        
        {/* Mobile Progress Bar */}
        <div className="mt-4 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-600 transition-all duration-500"
            style={{ 
              width: `${(currentIndex / (steps.length - 1)) * 100}%` 
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProgressStepper;