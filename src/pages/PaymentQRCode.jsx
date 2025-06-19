import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { addDoc, collection, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';

const PaymentQRCode = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reduxState = useSelector((state) => state.subscription);
  const reduxMethod = useSelector((state) => state.payment.paymentMethod);
  const userId = useSelector((state) => state.auth.user?.uid);

  const selectedPlanId = reduxState.selectedPlanId || localStorage.getItem('selectedPlanId');
  const billingCycle = reduxState.billingCycle || localStorage.getItem('billingCycle');
  const amount = reduxState.amount || parseInt(localStorage.getItem('amount')) || 0;
  const paymentMethod = reduxMethod || localStorage.getItem('paymentMethod');

  const QRImage =
    'https://api.vietqr.io/image/970422-0465179699999-NGUYENMINHQUANG.png?amount=' +
    amount +
    '&addInfo=MoviePlan_' +
    selectedPlanId;

  const handleConfirmPayment = async () => {
    try {
      setIsSubmitting(true);
      const docRef = await addDoc(collection(db, 'payments'), {
        userId,
        planId: selectedPlanId,
        billingCycle,
        amount,
        method: paymentMethod,
        status: 'pending',
        timestamp: serverTimestamp(),
      });
      localStorage.setItem('paymentId', docRef.id);
      alert('Thank you! We’ll verify your payment soon.');
      navigate('/');
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('Failed to confirm payment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

const handleVNPayPayment = async () => {
  try {
    const orderId = `movieplan_${Date.now()}`;
await setDoc(doc(db, "payments", orderId), {
  userId,
  planId: selectedPlanId,
  billingCycle,
  amount,
  method: "vnpay",
  status: "pending",
  timestamp: serverTimestamp(),
});

// Gửi request tới backend:
const response = await fetch("http://localhost:3001/create-payment", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    amount,
    orderId, // 👈 Bây giờ ID đã khớp với Firestore
    userId: userId || "guest",
  }),
});

    const data = await response.json();
    if (data.url) {
      localStorage.setItem('paymentId', orderId);
      window.location.href = data.url;
    } else {
      alert('Could not create VNPay payment. Please try again.');
    }
  } catch (error) {
    console.error('VNPay error:', error);
    alert('Error occurred while processing VNPay payment.');
  }
};


  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-xl mx-auto text-center">
        <h1 className="text-3xl font-bold mb-4">Complete Your Payment</h1>
        <p className="text-gray-400 mb-2">Plan: <strong className="text-white">{selectedPlanId}</strong></p>
        <p className="text-gray-400 mb-2">Cycle: <strong className="text-white capitalize">{billingCycle}</strong></p>
        <p className="text-gray-400 mb-6">Amount: <strong className="text-yellow-400">{amount.toLocaleString()} VND</strong></p>

        {paymentMethod === 'vietqr' ? (
          <>
            <p className="text-gray-400 mb-4">Scan this QR code using your banking app:</p>
            <div className="bg-white p-4 inline-block rounded-lg">
              <img src={QRImage} alt="QR Code" className="w-64 h-64 object-contain" />
            </div>
          </>
        ) : (
          <>
            <p className="text-gray-400 mb-4">Click below to proceed with VNPay:</p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-black font-bold rounded-lg hover:from-blue-400 hover:to-cyan-400"
              onClick={handleVNPayPayment}
            >
              Go to VNPay
            </button>
          </>
        )}

        <div className="mt-8 space-x-4">
          <button
            onClick={() => navigate('/subscription')}
            className="text-gray-400 hover:text-white underline text-sm"
          >
            ← Cancel and go back
          </button>
          {paymentMethod === 'vietqr' && (
          <button
            onClick={handleConfirmPayment}
            disabled={isSubmitting}
            className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600"
          >
            {isSubmitting ? 'Submitting...' : "I've paid"}
          </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentQRCode;
