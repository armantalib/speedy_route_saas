import React, { useState } from "react";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import "./CheckoutForm.css"; // We'll style it next
import { dataPost } from "../../utils/myAxios";

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: "#32325d",
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: "antialiased",
            fontSize: "16px",
            "::placeholder": {
                color: "#a0aec0",
            },
            padding: "12px 0",
        },
        invalid: {
            color: "#e53e3e",
            iconColor: "#e53e3e",
        },
    },
    hidePostalCode: true, // optional
};

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [amount, setAmount] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);
        setMessage("");

        // const res = await fetch("http://localhost:5000/create-payment-intent", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify({ amount: parseInt(amount) * 100 }), // in cents
        // });

        const endPoint = `company/payment/init`;
        const res = await dataPost(endPoint, {
            amount:amount
        });
        if (res?.data?.success) {
            const clientSecret = res.data?.clientSecret;

            const cardElement = elements.getElement(CardElement);

            const { paymentIntent, error } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: { card: cardElement },
                }
            );
        
        if (error) {
            setMessage(error.message);
        } else if (paymentIntent.status === "succeeded") {
            setMessage("✅ Payment Successful!");
                    setAmount(""); // clear input
        cardElement.clear(); // clear card fields
        
        }
    }
        setLoading(false);
    };

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Complete Your Payment</h2>

            <form onSubmit={handleSubmit} className="checkout-form">
                <label className="input-label">Amount (USD)</label>
                <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="amount-input"
                    required
                />

                <label className="input-label">Card Details</label>
                <div className="card-element-container">
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>

                <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="pay-button"
                >
                    {loading ? "Processing..." : "Pay Now"}
                </button>
            </form>

            {message && <p className="payment-message">{message}</p>}
        </div>
    );
}
