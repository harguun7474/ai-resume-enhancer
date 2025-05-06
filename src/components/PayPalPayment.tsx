import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { CheckCircle, XCircle } from 'lucide-react';

interface PayPalPaymentProps {
  amount: number;
  onSuccess: (details: any) => void;
  onCancel: () => void;
  onError: (error: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  amount,
  onSuccess,
  onCancel,
  onError
}) => {
  const [error, setError] = useState<string | null>(null);

  const initialOptions = {
    clientId: process.env.VITE_PAYPAL_CLIENT_ID || '',
    currency: 'NZD',
    intent: 'capture',
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: amount.toString(),
            currency_code: 'NZD',
          },
        },
      ],
    });
  };

  const onApprove = async (data: any, actions: any) => {
    try {
      const details = await actions.order.capture();
      onSuccess(details);
    } catch (error) {
      setError('Payment failed. Please try again.');
      onError(error);
    }
  };

  return (
    <div className="space-y-4">
      <PayPalScriptProvider options={initialOptions}>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-4">Pay with PayPal</h3>
          
          {error && (
            <div className="text-red-500 text-sm mb-4 flex items-center">
              <XCircle className="w-4 h-4 mr-2" />
              {error}
            </div>
          )}

          <PayPalButtons
            style={{
              layout: 'vertical',
              shape: 'rect',
              color: 'blue',
            }}
            createOrder={createOrder}
            onApprove={onApprove}
            onCancel={onCancel}
            onError={(err) => {
              setError('An error occurred with PayPal. Please try again.');
              onError(err);
            }}
          />

          <div className="mt-4 text-sm text-gray-500">
            <p>You will be redirected to PayPal to complete your payment.</p>
            <p className="mt-2">Amount: NZD ${amount.toFixed(2)}</p>
          </div>
        </div>
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment; 