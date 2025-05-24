
import { Header } from "@/components/Header";
import { BottomNavigation } from "@/components/BottomNavigation";
import { Button } from "@/components/ui/button";
import { CreditCard, Plus, Trash2 } from "lucide-react";

const PaymentMethods = () => {
  const paymentMethods = [
    {
      id: "1",
      type: "Visa",
      last4: "4242",
      expiry: "12/25",
      isDefault: true
    },
    {
      id: "2", 
      type: "Mastercard",
      last4: "8888",
      expiry: "08/26",
      isDefault: false
    }
  ];

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <Header title="Payment Methods" showBack={true} showSettings={false} backTo="/settings" />
      
      <div className="px-4 py-6">
        <div className="mb-6">
          <Button className="w-full bg-purple-500 hover:bg-purple-600 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add Payment Method
          </Button>
        </div>

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mr-4">
                    <CreditCard className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-medium">{method.type} •••• {method.last4}</p>
                    <p className="text-sm text-gray-500">Expires {method.expiry}</p>
                    {method.isDefault && (
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded mt-1 inline-block">
                        Default
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <Trash2 className="w-5 h-5 text-red-500" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default PaymentMethods;
