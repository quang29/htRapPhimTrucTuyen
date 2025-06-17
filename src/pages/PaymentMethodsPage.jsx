import React, { useState } from 'react';

const PaymentMethodsPage = () => {
  const [selectedMethod, setSelectedMethod] = useState(null);

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit or Debit Card',
      icon: '💳',
      description: 'Visa, Mastercard, American Express',
      logos: ['VISA', 'MC', 'AMEX']
    },
    {
      id: 'momo',
      name: 'MoMo E-Wallet',
      icon: '📱',
      description: 'Pay with your MoMo wallet',
      logos: ['MOMO']
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      icon: '💙',
      description: 'Pay with ZaloPay wallet',
      logos: ['ZALOPAY']
    },
    {
      id: 'banking',
      name: 'Internet Banking',
      icon: '🏦',
      description: 'Direct bank transfer',
      logos: ['BANK']
    }
  ];

  const handleMethodSelect = (methodId) => {
    setSelectedMethod(methodId);
  };

  const handleNext = () => {
    if (!selectedMethod) {
      alert('Please select a payment method');
      return;
    }
    // Dispatch to Redux store
    // dispatch(setPaymentMethod(selectedMethod));
    console.log('Selected payment method:', selectedMethod);
    // Navigate to payment confirmation page
  };

  const handleBack = () => {
    // Navigate back to subscription page
    console.log('Going back to subscription page');
  };

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {/* Step 1 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                ✓
              </div>
              <span className="ml-2 text-green-400 font-medium">Choose Plan</span>
            </div>
            
            {/* Connector */}
            <div className="w-12 h-0.5 bg-yellow-500"></div>
            
            {/* Step 2 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center text-black font-bold text-sm">
                2
              </div>
              <span className="ml-2 text-white font-medium">Payment Method</span>
            </div>
            
            {/* Connector */}
            <div className="w-12 h-0.5 bg-gray-700"></div>
            
            {/* Step 3 */}
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-gray-400 font-bold text-sm">
                3
              </div>
              <span className="ml-2 text-gray-400">Confirm</span>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <p className="text-gray-400 text-sm">Step 2 of 3</p>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-black" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Choose how to pay
          </h1>
          
          <p className="text-gray-400 text-lg max-w-md mx-auto mb-2">
            Your payment is encrypted and you can change how you pay anytime.
          </p>
          
          <div className="text-white font-semibold">
            Secure for peace of mind.
          </div>
          <div className="text-white font-semibold">
            Cancel easily online.
          </div>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center bg-gray-900 rounded-lg px-4 py-2 border border-gray-700">
            <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-gray-300">End-to-end encrypted</span>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-4 mb-12">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              onClick={() => handleMethodSelect(method.id)}
              className={`bg-gray-900 border rounded-lg p-6 cursor-pointer transition-all duration-300 hover:bg-gray-800 ${
                selectedMethod === method.id 
                  ? 'border-yellow-500 ring-2 ring-yellow-500/50' 
                  : 'border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="text-2xl mr-4">{method.icon}</div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{method.name}</h3>
                    <p className="text-gray-400 text-sm">{method.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  {method.logos.map((logo, index) => (
                    <div key={index} className="ml-2">
                      {logo === 'VISA' && (
                        <div className="w-8 h-5 bg-blue-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          VISA
                        </div>
                      )}
                      {logo === 'MC' && (
                        <div className="w-8 h-5 bg-red-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          MC
                        </div>
                      )}
                      {logo === 'AMEX' && (
                        <div className="w-8 h-5 bg-green-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          AMEX
                        </div>
                      )}
                      {logo === 'MOMO' && (
                        <div className="w-8 h-5 bg-pink-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          M
                        </div>
                      )}
                      {logo === 'ZALOPAY' && (
                        <div className="w-8 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                          Z
                        </div>
                      )}
                      {logo === 'BANK' && (
                        <div className="w-8 h-5 bg-gray-600 rounded text-white text-xs flex items-center justify-center font-bold">
                          🏦
                        </div>
                      )}
                    </div>
                  ))}
                  
                  <svg className="w-6 h-6 text-gray-400 ml-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              
              {selectedMethod === method.id && (
                <div className="mt-4 pt-4 border-t border-gray-700">
                  <div className="flex items-center text-yellow-500">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium">Selected</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between">
          <button 
            onClick={handleBack}
            className="flex items-center text-gray-400 hover:text-white transition-colors duration-300"
          >
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
                ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-black hover:from-yellow-400 hover:to-orange-500'
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