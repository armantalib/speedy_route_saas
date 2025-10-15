import React, { useEffect, useState } from "react";
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

export default function CheckoutForm({onContinue}) {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [totalAmount, setTotalAmount] = useState(0);
    const [amount, setAmount] = useState("");

    useEffect(() => {
        checkAmount();
    }, [])

    const checkAmount = async () => {
        let addonsPrice = 0;
        let totalAmount = 0
        const addon_final = localStorage.getItem('addon_final')
        if (addon_final) {
            let anPo = JSON.parse(addon_final);
            addonsPrice = anPo?.addonsPrice;
        }
        const plan = localStorage.getItem('plan')
        if (plan) {
            let anPo = JSON.parse(plan);
            totalAmount = anPo?.price + addonsPrice;
            setTotalAmount(totalAmount)
        }
    }


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
        let addonsPrice = 0;
        let totalAmount = 0
        const addon_final = localStorage.getItem('addon_final')
        if (addon_final) {
            let anPo = JSON.parse(addon_final);
            addonsPrice = anPo?.addonsPrice;
        }
        const plan = localStorage.getItem('plan')
        if (plan) {
            let anPo = JSON.parse(plan);
            totalAmount = anPo?.price + addonsPrice;
            setTotalAmount(totalAmount)
        }
        const endPoint = `company/payment/init`;
        const res = await dataPost(endPoint, {
            amount: totalAmount
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
                subscribePackage(paymentIntent)
                setMessage("✅ Payment Successful!");
                setAmount(""); // clear input
                cardElement.clear(); // clear card fields

            }
        }
    };

    const subscribePackage = async (paymentIntent) => {
        let addonsN = null
        let plans = null
        let users = null
        const addon_final = localStorage.getItem('addon_final')
        if (addon_final) {
            addonsN = JSON.parse(addon_final);
        }
        const plan = localStorage.getItem('plan')
        if (plan) {
            plans = JSON.parse(plan);
        }
        const user = localStorage.getItem('login_admin_data')
        if (user) {
            users = JSON.parse(user);
        }
        let data = {
            companyId: users?.company,
            planId: plans?._id,
            planType: plans?.plan_type,
            paymentId: paymentIntent?.id,
            addons: addonsN?.addons,
        }
        const endPoint = `company/subscribe/package`;
        const res = await dataPost(endPoint, data);
        setLoading(false);

        if (res?.data?.success) {
            localStorage.removeItem('addon_final')
            localStorage.removeItem('plan')
            onContinue()
        }


    }

    return (
        <div className="checkout-container">
            <h2 className="checkout-title">Complete Your Payment</h2>

            <form onSubmit={handleSubmit} className="checkout-form">
                <label className="input-label">Amount (USD) {totalAmount}</label>
                {/* <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="amount-input"
                    required
                /> */}

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
