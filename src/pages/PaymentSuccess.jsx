import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const PaymentSuccess = () => {
  const location = useLocation();
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

  if (!paymentInfo) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">🎉 Payment Result</h1>
      {paymentInfo.status === "00" ? (
        <p className="text-green-400">Your payment was successful!</p>
      ) : (
        <p className="text-red-400">Payment failed or cancelled.</p>
      )}
      <p className="mt-4">Transaction: <strong>{paymentInfo.txnRef}</strong></p>
      <p>Amount: <strong>{(Number(paymentInfo.amount) / 100).toLocaleString()} VND</strong></p>
    </div>
  );
};

export default PaymentSuccess;
