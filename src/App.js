import "./App.css";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const hasFetched = useRef(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const paymentID = queryParams.get("paymentID");
    const status = queryParams.get("status");

    console.log("Payment ID:", paymentID);
    console.log("Status:", status);

    if (paymentID && status && !hasFetched.current) {
      hasFetched.current = true;

      const data = {
        status: "success",
        paymentID: paymentID,
      };

      const callUpdateAPI = async () => {
        try {
          const response = await fetch("https://api.realbdgame.com/api/v1/payment/update-status", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          });

          const result = await response.json();

          const { res, error } = result;

          await fetch("https://api.realbdgame.com/open-app", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ packageName: "com.DefaultCompany.Carrom" }),
          });

          if (error) {
            setError(error);
            console.error("Error:", error);
          } else {
            console.log("Response:", res);
          }
        } catch (err) {
          console.error("API call failed:", err);
        }
      };

      callUpdateAPI();
    }
  }, [location.search]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <h1 className="dot-animate">Payment Completing, wait for a moment</h1>
      {error && <p>{error}</p>}
    </div>
  );
}

export default App;
