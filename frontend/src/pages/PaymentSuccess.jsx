import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux'; // Redux import kiya
import { clearCartState } from '../redux/slices/cartSlice'; // Sahi action import kiya
import api from '../utils/api';
import { toast } from 'sonner'; // Toast import kiya

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); // Dispatch initialize kiya
  
  const [verifying, setVerifying] = useState(true);
  const [success, setSuccess] = useState(false);

  const verifyCalled = useRef(false);

  useEffect(() => {
    if (verifyCalled.current) return;
    verifyCalled.current = true;
    verifyPayment();
  }, []);

  const verifyPayment = async () => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      navigate('/checkout');
      return;
    }

    try {
      const response = await api.post('/payment/verify-session', { sessionId });
      if (response.data.success) {
        dispatch(clearCartState()); // Redux se cart clear kiya
        setSuccess(true);
      }
    } catch (error) {
      console.error('Payment verification failed:', error);
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setVerifying(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen flex justify-center items-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
          <h2 className="text-xl font-medium">Verifying payment...</h2>
          <p>Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex justify-center items-center p-6">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        {success ? (
          <>
            <div className="text-5xl text-green-600 mb-4">✓</div>
            <h1 className="text-2xl font-semibold text-green-600 mb-2">Payment Successful!</h1>
            <p className="text-lg text-gray-800 mb-1">
              Your order has been placed successfully.
            </p>
            <p className="text-gray-500 mb-6">
              You will receive an email confirmation shortly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 border border-gray-800 text-gray-800 rounded-md hover:bg-gray-100"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-5xl text-red-600 mb-4">✗</div>
            <h1 className="text-2xl font-semibold text-red-600 mb-2">Payment Failed</h1>
            <p className="text-lg text-gray-800 mb-4">
              There was an issue processing your payment.
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="px-6 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700"
            >
              Try Again
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;