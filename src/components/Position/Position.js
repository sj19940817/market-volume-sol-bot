import React, { useState } from "react";
import "./Position.css";
import { Button } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../config";

const Position = (props) => {
  const [sellall, setSellALL] = useState(false);
  let total_SOL = 0;
  let total_Token = 0;
  let total_PNL = 0;
  let token_amount_list = [];
  const tokenaddress = props.tokenaddress;

  props.tableData.map((row) => {
    total_SOL += row.sol_amount;
    total_Token += row.token_amount;
    total_PNL += row.pnl;
    token_amount_list.push(row.token_amount);
  });

  const handleSellAll = async () => {
    if (!tokenaddress) {
      alert("Please input Token address");
      return;
    }
    setSellALL(true);
    try {
      const res = await axios.get(`${API_URL}sellsall`, {
        params: {
          tokenaddress: tokenaddress,
          token_amount_list: token_amount_list,
        },
      });
      console.log(res.data);
      props.setFetchCount((prev) => prev + 1);
      if (res.data) setSellALL(false);
    } catch (err) {
      console.log("error");
    }
  };

  return (
    <div className="position">
      <p className="position-title">Positions</p>
      <div className="position-container">
        <div className="p-item">
          <label>SOL Amounts</label>
          <span>{total_SOL.toFixed(3)}</span>
        </div>
        <div className="p-item">
          <label>Token Amount</label>
          <span>{total_Token.toFixed(3)}</span>
        </div>
        <div className="p-item">
          <label>PNL</label>
          <span>{total_PNL.toFixed(3)}</span>
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
        className="position-sell"
        onClick={() => handleSellAll()}
        disabled={total_Token.toFixed(3) == 0 || sellall ? true : false}
      >
        {sellall ? "SELLING" : "SELL ALL"}
      </Button>
    </div>
  );
};

export default Position;
