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
        if (response.status === 200) {
          // Filter the purchase history items based on the artist_id from localStorage
          const filteredItems = response.data.items.filter(
            (item) => parseInt(item.artist_id) === parseInt(artistId)
          );
          setPurchaseHistory(filteredItems);
        }
      } catch (error) {
        console.error("Failed to fetch purchase history:", error);
      }
    };

    if (artistId) {
      fetchPurchaseHistory();
    }
  }, [artistId]);

  return (
    <div>
      <style>
        {`
          .purchase-history-container {
            margin: 20px;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            background-color: #f9f9f9;
          }

          .purchase-history-container h1 {
            text-align: center;
            margin-bottom: 20px;
            color: #333;
          }

          .purchase-history-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }

          .purchase-history-table th,
          .purchase-history-table td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }

          .purchase-history-table th {
            background-color: #4CAF50;
            color: white;
          }

          .purchase-history-table tr:nth-child(even) {
            background-color: #f2f2f2;
          }

          .purchase-history-table tr:hover {
            background-color: #ddd;
          }

          .purchase-history-table img {
            max-width: 100px;
            border-radius: 5px;
          }

          @media (max-width: 768px) {
            .purchase-history-table,
            .purchase-history-table th,
            .purchase-history-table td {
              display: block;
            }

            .purchase-history-table th {
              text-align: right;
            }

            .purchase-history-table th::after {
              content: ":";
            }

            .purchase-history-table tr {
              margin-bottom: 10px;
            }
          }
        `}
      </style>
      <Navbar />
      <div className="purchase-history-container">
        <h1>View Purchase Details</h1>
        <table className="purchase-history-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Caption</th>
              <th>Description</th>
              <th>Category</th>
              <th>Image</th>
              <th>Price</th>
              <th>Total Price</th>
              <th>Quantity</th>
              <th>Rating</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {purchaseHistory.map((item) => (
              <tr key={item.purchase_id}>
                <td>{item.user_id}</td>
                <td>{item.caption}</td>
                <td>{item.description}</td>
                <td>{item.category}</td>
                <td>
                  <img
                    src={`data:image/jpeg;base64,${item.image}`}
                    alt="Artwork"
                  />
                </td>
                <td>{item.price}</td>
                <td>{item.total_price}</td>
                <td>{item.quantity}</td>
                <td>{item.rating}</td>
                <td>{item.feedback}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ViewPurchaseHistory;
