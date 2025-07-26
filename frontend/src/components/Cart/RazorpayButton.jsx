import React from "react";

const RazorpayButton = ({ amount, onSuccess, onError }) => {
  const handlePayment = () => {
    const options = {
      key: "rzp_test_YourKeyHere", // Replace with your Razorpay Test Key
      amount: amount * 100, // Razorpay expects amount in paisa
      currency: "INR",
      name: "KW Solutions Pvt. Ltd.",
      description: "Order Payment",
    //   image: "https://yourlogo.com/logo.png", // optional
      handler: function (response) {
        // On successful payment
        console.log("Payment Successful", response);
        onSuccess(response); // This will trigger navigate to order-confirmation
      },
      prefill: {
        name: "John Doe", // Optional
        email: "johndoe@example.com", // Optional
        contact: "9999999999", // Optional
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();

    rzp.on("payment.failed", function (response) {
      console.error(response.error);
      onError(response.error); // Show error alert
    });
  };

  return (
    <button
      onClick={handlePayment}
      className="w-full bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700"
    >
      Pay with Razorpay
    </button>
  );
};

export default RazorpayButton;
