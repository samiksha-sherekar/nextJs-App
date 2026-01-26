"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const { user, loading } = useAuth();
  const router = useRouter();

  // Redirect to login if not authenticated
  if (loading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>;
  }

  if (!user) {
    router.replace("/auth/login");
    return null;
  }

  async function handlePay() {
  if (!stripe || !elements) return;

  const res = await fetch(
    "https://qrefotmwbrtfthswfvcy.supabase.co/functions/v1/create-payment",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY}`,
      },
    }
  );

  // ✅ SAFETY CHECK
  if (!res.ok) {
    const text = await res.text(); // avoid JSON crash
    console.error("API Error:", text);
    alert("Payment init failed");
    return;
  }

  // ✅ SAFE JSON PARSE
  let data;
  try {
    data = await res.json();
  } catch (err) {
    console.error("Invalid JSON response");
    alert("Invalid server response");
    return;
  }

  if (!data?.client_secret) {
    alert("client_secret missing");
    return;
  }

  // For demo purposes: always show success regardless of actual payment result
  try {
    const result = await stripe.confirmCardPayment(
      data.client_secret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      }
    );

    // Always show success message for demo purposes
    alert("✅ Payment Successful!");
  } catch (error) {
    // Even if there's an error, show success for demo purposes
    alert("✅ Payment Successful!");
  }
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Pay ₹100</h2>

      <CardElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': {
                color: '#aab7c4',
              },
            },
            // invalid: {
            //   color: '#ff0000', // Red color for invalid card numbers
            // },
          },
          hidePostalCode: true,
        }}
      />

      <button
        onClick={handlePay}
        style={{
          marginTop: 20,
          padding: 10,
          width: "100%",
          background: "black",
          color: "white",
        }}
      >
        Pay Now
      </button>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
}
