"use client";

import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  increaseQuantity,
  decreaseQuantity,
  removeItem,
  clearCart
} from "@/store/cartSlice";
import { createOrder } from "../../app/actions/OrderActions";
import { useRouter } from "next/navigation";

const Cart = () => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentStatusLoading, setPaymentStatusLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  const router = useRouter();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items || []);

  const total = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayClick = () => {
    // Start loader
    setPaymentStatusLoading(true);
    setPaymentSuccess(false);

    // Simulate 3s delay
    setTimeout(() => {
      setPaymentStatusLoading(false);
      setPaymentSuccess(true);
    }, 3000);
  };

  const handleContinue = async () => {
    try{
      await createOrder({
        items: cart
      });
      dispatch(clearCart());
      router.push("/orders");

    }catch(error){
      console.error("Error clearing cart:", error);
    }

    setShowPaymentModal(false);
    setPaymentSuccess(false);

  };

  return (
    <div className="p-6 w-full h-auto min-w-[300px]">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item._id}
              className="bg-white p-4 shadow rounded mb-4 flex justify-between min-w-[420px]"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-12 h-12 object-cover rounded"
                />
                <div>
                  <h2 className="font-bold">{item.name}</h2>
                  <p>
                    ₹{item.price} × {item.quantity} = <b>₹{item.price * item.quantity}</b>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => dispatch(decreaseQuantity(item._id))}
                  className="px-3 bg-gray-300"
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => dispatch(increaseQuantity(item._id))}
                  className="px-3 bg-gray-300"
                >
                  +
                </button>
                <button
                  onClick={() => dispatch(removeItem(item._id))}
                  className="px-3 bg-orange-600 text-white rounded-md"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex justify-between items-center mt-6 p-4 bg-green-100 rounded text-xl font-bold min-w-[420px]">
            <h4>Total Amount: ₹{total}</h4>
            <button
              onClick={() => setShowPaymentModal(true)}
              className="px-4 py-2 bg-green-500 text-white rounded-lg"
            >
              Proceed to Payment
            </button>
          </div>
        </>
      )}

      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[400px]">
            {paymentStatusLoading ? (
              <div className="text-center">
                <div className="text-6xl mb-3">⏳</div>
                <h2 className="text-2xl font-bold text-blue-600">Processing Payment...</h2>
                <p className="mt-2">Please wait while we process your payment.</p>
              </div>
            ) : paymentSuccess ? (
              <div className="text-center">
                <div className="text-6xl mb-3">✅</div>
                <h2 className="text-2xl font-bold text-green-600">Payment Successful</h2>
                <p className="mt-2">Your order has been placed successfully.</p>
                <button
                  onClick={handleContinue}
                  className="mt-5 px-5 py-2 bg-green-600 text-white rounded"
                >
                  Continue
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-4">Payment Gateway</h2>
                <p className="mb-4">Amount to Pay: <b>₹{total}</b></p>

                <input type="text" placeholder="Card Number" className="w-full border p-2 rounded mb-3" />
                <input type="text" placeholder="Card Holder Name" className="w-full border p-2 rounded mb-3" />

                <div className="flex gap-2 mb-4">
                  <input type="text" placeholder="MM/YY" className="w-1/2 border p-2 rounded" />
                  <input type="password" placeholder="CVV" className="w-1/2 border p-2 rounded" />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayClick}
                    className="px-4 py-2 bg-green-600 text-white rounded"
                  >
                    Pay ₹{total}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
