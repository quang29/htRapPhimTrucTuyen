// PaymentMethodsPage.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPaymentMethod } from '../store/paymentSlice';

const PaymentMethodsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null); // Lưu phương thức thanh toán đã chọn
  const dispatch = useDispatch(); // Gửi dữ liệu đến Redux store
  const navigate = useNavigate();

  const paymentMethods = [
    { id: 'vietqr', name: 'VietQR', icon: '🏦', description: 'Scan QR using your banking app' },
    { id: 'vnpay', name: 'VNPay', icon: '💳', description: 'Pay using VNPay gateway' },
  ];

  // xu ly khi an nut next
  const handleNext = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    dispatch(setPaymentMethod(selectedMethod)); // gui phương thức thanh toán đã chọn đến Redux
    localStorage.setItem('paymentMethod', selectedMethod); // Lưu phương thức thanh toán vào localStorage de ko mat khi load lai
    navigate('/payment-qr-code');
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Choose your payment method</h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">
            All payments are secure and encrypted.
          </p>
        </div>

        <div className="space-y-6 mb-12">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`bg-gray-900 border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                selectedMethod === method.id
                  ? 'border-yellow-500 ring-2 ring-yellow-500/50'
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-2xl mr-4">{method.icon}</span>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                </div>
                {selectedMethod === method.id && (
                  <div className="text-yellow-500 font-semibold">✓</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/subscription')} className="text-gray-400 hover:text-white flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={!selectedMethod}
            className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
              selectedMethod
                ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage;
