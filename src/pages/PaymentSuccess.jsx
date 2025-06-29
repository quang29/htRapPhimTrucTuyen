import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const status = queryParams.get("vnp_ResponseCode");
    const txnRef = queryParams.get("vnp_TxnRef");
    const amount = queryParams.get("vnp_Amount");

    setPaymentInfo({
      status,
      txnRef,
      amount,
    });
  }, [location]);

  useEffect(() => {
    if (paymentInfo && paymentInfo.status === "00" && paymentInfo.txnRef) {
      setDoc(doc(db, "payments", paymentInfo.txnRef), {
        status: "success",
        vnp_ResponseCode: paymentInfo.status,
        updatedAt: new Date()
      }, { merge: true });
    }
  }, [paymentInfo]);

  if (!paymentInfo) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );

  const isSuccess = paymentInfo.status === "00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center px-4">
      <div className="bg-gradient-to-tr from-neutral-900 to-neutral-800 rounded-3xl shadow-2xl p-10 max-w-md w-full text-center border border-white/10 animate-fadeIn">
        <div className="flex flex-col items-center mb-6">
          {isSuccess ? (
            <svg className="w-20 h-20 text-green-400 mb-2 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" fill="#22c55e" opacity="0.2"/>
              <path stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M7 13l3 3 7-7" />
            </svg>
          ) : (
            <svg className="w-20 h-20 text-red-400 mb-2 animate-shake" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <circle cx="12" cy="12" r="10" fill="#ef4444" opacity="0.2"/>
              <path stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6m0-6l6 6" />
            </svg>
          )}
          <h1 className="text-3xl font-extrabold mb-2">
            {isSuccess ? "Payment Successful!" : "Payment Failed"}
          </h1>
          <p className={`text-lg ${isSuccess ? "text-green-300" : "text-red-300"}`}>
            {isSuccess
              ? "Thank you for your purchase. Your subscription is now active!"
              : "Sorry, your payment was not successful. Please try again or contact support."}
          </p>
        </div>
        <div className="bg-neutral-800/80 rounded-xl p-4 mb-6 text-left text-sm text-neutral-200 shadow-inner">
          <div className="flex justify-between mb-1">
            <span className="font-semibold">Transaction:</span>
            <span>{paymentInfo.txnRef}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount:</span>
            <span>{(Number(paymentInfo.amount) / 100).toLocaleString()} VND</span>
          </div>
        </div>
        <button
          onClick={() => navigate(isSuccess ? "/subscription" : "/")}
          className={`w-full py-2 rounded-lg font-bold transition 
            ${isSuccess
              ? "bg-gradient-to-tr from-green-400 to-green-600 text-black hover:scale-105"
              : "bg-gradient-to-tr from-red-400 to-red-600 text-white hover:scale-105"
            }`}
        >
          {isSuccess ? "Go to Subscription" : "Back to Home"}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
