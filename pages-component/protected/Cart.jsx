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
    <div className="min-h-screen w-full min-w-[300px] mt-10">
      <h1 className="text-3xl font-bold mb-6">Cart</h1>

        {cart.length === 0 ? (
          <p>Cart is empty</p>
        ) : (
          <>
            <div className="min-w-[300px]">
              {cart.map(item => (
                <div
                  key={item._id}
                  className="bg-white p-2 shadow rounded mb-2 flex justify-between"
                >
                  <div className="flex items-center gap-2">

                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded"
                    />
                    <div className="min-w-[75px]">
                      <h2 className="font-bold text-[20px] [@media(max-width:600px)]:text-[12px] [@media(max-width:300px)]:text-[8px]">{item.name}</h2>
                      <p className="text-[12px] [@media(max-width:600px)]:text-[8px] [@media(max-width:300px)]:text-[6px]">
                        ₹{item.price} × {item.quantity} = <b>₹{item.price * item.quantity}</b>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 min-w-[150px]">
                    <button
                      onClick={() => dispatch(decreaseQuantity(item._id))}
                      className="bg-gray-300 w-6 h-6"
                    >
                      -
                    </button>
                    <span
                    >{item.quantity}</span>
                    <button
                      onClick={() => dispatch(increaseQuantity(item._id))}
                      className="bg-gray-300 w-6 h-6"
                    >
                      +
                    </button>
                    <button
                      onClick={() => dispatch(removeItem(item._id))}
                      className="px-2 bg-orange-600 text-white rounded-md w-fit h-7 [@media(max-width:600px)]:text-[12px] [@media(max-width:300px)]:text-[8px]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>


            <div className="flex justify-between items-center mt-6 p-4 bg-green-100 rounded text-xl font-bold min-w-[300px]">
              <h4 
                className="[@media(max-width:600px)]:text-[16px] [@media(max-width:300px)]:text-[10px"
              >Total Amount: ₹{total}</h4>
              <button
                onClick={() => setShowPaymentModal(true)}
                className="px-2 py-2 bg-green-500 text-white rounded-lg [@media(max-width:600px)]:text-[12px] [@media(max-width:300px)]:text-[8px]"
              >
                Proceed to Payment
              </button>
            </div>
          </>
        )}

        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 min-w-[300px] m-5 p-5">
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
