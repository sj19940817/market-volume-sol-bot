import React from "react";
import "./Position.css";
import { Button } from "react-bootstrap";
const Position = () => {
  return (
    <div className="position">
      <p className="position-title">Positions</p>
      <div className="position-container">
        <div className="p-item">
          <label>SOL Amounts</label>
          <span>75.5</span>
        </div>
        <div className="p-item">
          <label>Token Amount</label>
          <span>75.5</span>
        </div>
        <div className="p-item">
          <label>PNL</label>
          <span>10.5%</span>
        </div>
      </div>
      <Button
        style={{
          backgroundColor: "red",
          borderColor: "red",
          fontWeight: "600",
          width: "90px",
          fontSize: "15px",
        }}
      >
        SELL ALL
      </Button>
    </div>
  );
};

export default Position;
