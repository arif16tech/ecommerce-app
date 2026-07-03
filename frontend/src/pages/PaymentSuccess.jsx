import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clearCartState } from '../redux/slices/cartSlice'; 
import api from '../utils/api';
import { toast } from 'sonner';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch(); 
  
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
        dispatch(clearCartState()); 
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
        <div className="bg-slate-900/50 p-10 rounded-3xl shadow-lg border border-slate-800 text-center max-w-md">
          <h2 className="text-xl font-bold text-white mb-2">Verifying payment...</h2>
          <p className="text-slate-400">Please wait while we confirm your payment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex justify-center items-center p-6">
      <div className="bg-slate-900/50 p-10 rounded-3xl shadow-lg border border-slate-800 text-center max-w-md w-full">
        {success ? (
          <>
            <div className="text-6xl text-emerald-400 mb-6 drop-shadow-sm">✓</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Payment Successful!</h1>
            <p className="text-lg text-slate-300 mb-2">
              Your order has been placed successfully.
            </p>
            <p className="text-slate-400 mb-8">
              You will receive an email confirmation shortly.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={() => navigate('/orders')}
                className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
              >
                View Orders
              </button>
              <button
                onClick={() => navigate('/')}
                className="px-6 py-3 bg-slate-800 border border-slate-700 text-white font-bold rounded-xl hover:bg-slate-700 transition-colors shadow-sm"
              >
                Continue Shopping
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-6xl text-red-500 mb-6 drop-shadow-sm">✗</div>
            <h1 className="text-2xl font-extrabold text-white mb-2">Payment Failed</h1>
            <p className="text-lg text-slate-400 mb-8">
              There was an issue processing your payment.
            </p>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-200 transition-colors shadow-lg"
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