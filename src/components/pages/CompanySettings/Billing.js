// App.js
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";

const stripePromise = loadStripe("pk_test_51RK1BPDHVlaPXj71J8A0MiUKEpMSfe2EpjA9J48KmiFlfeY700VYNPGM9tB7llETgVSfLAcvVQuawdLzcacunAfD00Y3ZNSjHW"); // Your Publishable Key

function Billing() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}

export default Billing;
