import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PaymentSuccess = () => {
  const location = useLocation(); //de lay thong tin tu url
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null); // luu trang thai, ma giao dich va so tien

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search); // Lấy các tham số từ URL(urlsearchparams giup lay thong tin sau dau ?)
    const status = queryParams.get("vnp_ResponseCode"); // Lấy mã phản hồi từ VNPay
    const txnRef = queryParams.get("vnp_TxnRef"); // Lấy mã giao dịch từ VNPay
    const amount = queryParams.get("vnp_Amount"); // Lấy số tiền từ VNPay

    setPaymentInfo({ // sau do luu vao setpaymentInfo
      status,
      txnRef,
      amount,
    });
  }, [location]);

  // Lưu thông tin vào Firestore khi thanht toan thanh cong
  useEffect(() => {
    if (paymentInfo && paymentInfo.status === "00" && paymentInfo.txnRef) { // neu status la 00 va co ma giao dich
      setDoc(doc(db, "payments", paymentInfo.txnRef), { // Luu thong tin giao dich vao Firestore
        status: "success",
        vnp_ResponseCode: paymentInfo.status,
        updatedAt: new Date()
      }, { merge: true }); // merge true giu lai cac truong cu
    }
  }, [paymentInfo]);

  if (!paymentInfo) return (
    <div className="min-h-screen bg-gradient-to-br from-black via-neutral-900 to-black flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">Loading...</div>
    </div>
  );

  // Kiem tra trang thai thanh toan
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
            {/* // vi vnpay tra ve thua 100 nen Chia cho 100 de chuyen doi sang VND */}
          </div>
        </div>
        <button
          onClick={() => navigate(isSuccess ? "/" : "/subscription")}
          className={`w-full py-2 rounded-lg font-bold transition 
            ${isSuccess
              ? "bg-gradient-to-tr from-green-400 to-green-600 text-black hover:scale-105"
              : "bg-gradient-to-tr from-red-400 to-red-600 text-white hover:scale-105"
            }`}
        >
          {isSuccess ? "Back to Home" : "Go to Subscription"}
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
