import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "./Manual.css";
import axios from "axios";

const Manual = (props) => {
  const [value, setValue] = useState(0);
  const API_URL = "http://localhost:8080/";
  const tokenaddress = props.tokenaddress;

  const handleBuy = async () => {
    if (!tokenaddress) {
      alert("Please input token address");
      return;
    }
    if (value == 0) {
      alert("Please input sol amount");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}manual`, {
        params: {
          option: "buy",
          amount: value,
          tokenaddress: tokenaddress,
        },
      });
      props.setFetchCount((prev) => prev + 1);
    } catch (error) {}
  };

  const handleSell = async () => {
    if (!tokenaddress) {
      alert("Please input token address");
      return;
    }
    if (value == 0) {
      alert("Please input sol amount");
      return;
    }
    try {
      const res = await axios.get(`${API_URL}manual`, {
        params: {
          option: "sell",
          amount: value,
          tokenaddress: tokenaddress,
        },
      });
    } catch (error) {}
  };

  return (
    <div className="manual">
      <p className="manual-title">Manual Override</p>
      <InputGroup size="lg" className="maxval" style={{ marginTop: "2em" }}>
        <Form.Control
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          type="number"
          placeholder="0"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroup.Text>SOL / Tokens</InputGroup.Text>
      </InputGroup>
      <div className="manual-buy-sell-btn">
        <Button
          style={{
            backgroundColor: "chartreuse",
            borderColor: "chartreuse",
            fontWeight: "600",
            width: "80px",
            fontSize: "20px",
          }}
          className="manual-buy-btn"
          onClick={() => handleBuy()}
        >
          Buy
        </Button>
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Button
          style={{
            backgroundColor: "red",
            borderColor: "red",
            fontWeight: "600",
            width: "80px",
            fontSize: "20px",
          }}
          className="manual-sell-btn"
          onClick={() => handleSell()}
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default Manual;
