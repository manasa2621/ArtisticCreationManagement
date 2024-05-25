import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const ViewPurchaseHistory = () => {
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const artistId = localStorage.getItem("artist_id");

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const response = await axios.get("http://localhost:5000/view-items");
        console.log("Response from backend:", response.data); // Log the response

        if (response.status === 200) {
          // Ensure artistId is parsed as an integer
          const parsedArtistId = parseInt(artistId);
          
          // Filter items where artist_id matches parsedArtistId
          const artistPurchases = response.data.items.filter(
            (item) => parseInt(item.user_id) === parsedArtistId
          );

          console.log("Filtered purchases:", artistPurchases); // Log the filtered purchases
          setPurchaseHistory(artistPurchases);
        }
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      }
    };

    if (artistId) {
      fetchPurchaseHistory();
    }
  }, [artistId]);

  console.log("purchaseHistory:", purchaseHistory); // Log the purchase history state

  return (
    <div>
      <Navbar />
      <h1 style={{alignItems:"center"}}>Sales Details</h1>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#f2f2f2" }}>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Image
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Category
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Price
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Total Price
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Quantity
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Rating
            </th>
            <th
              style={{
                border: "1px solid #ddd",
                padding: "8px",
                textAlign: "left",
              }}
            >
              Feedback
            </th>
          </tr>
        </thead>
        <tbody>
          {purchaseHistory.map((item) => (
            <tr key={item.id}>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${item.image}`}
                  alt="Artwork"
                  style={{ maxWidth: "100px" }}
                />
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.category}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.price}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.total_price}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.quantity}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.rating}
              </td>
              <td
                style={{
                  border: "1px solid #ddd",
                  padding: "8px",
                  textAlign: "left",
                }}
              >
                {item.feedback}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

};

export default ViewPurchaseHistory;
