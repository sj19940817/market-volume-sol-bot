import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import "./Manual.css";
import axios from "axios";
import { API_URL } from "../config";

const Manual = (props) => {
  const [value, setValue] = useState(0);
  const [isBuyRunning, setIsBuyRunning] = useState(false);
  const [isSellRunning, setIsSellRunning] = useState(false);
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
    setIsBuyRunning(true);
    try {
      const res = await axios.get(`${API_URL}manual`, {
        params: {
          option: "buy",
          amount: value,
          tokenaddress: tokenaddress,
        },
      });
      props.setFetchCount((prev) => prev + 1);
      if (res.data) setIsBuyRunning(false);
    } catch (error) {}
  };

  const handleSell = async () => {
    if (!tokenaddress) {
      alert("Please input token address");
      return;
    }
    if (value == 0) {
      alert("Please input Token amount");
      return;
    }
    setIsSellRunning(true);
    try {
      const res = await axios.get(`${API_URL}manual`, {
        params: {
          option: "sell",
          amount: value,
          tokenaddress: tokenaddress,
        },
      });
      props.setFetchCount((prev) => prev + 1);
      if (res.data) setIsSellRunning(false);
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
            marginRight: "1em",
          }}
          className="manual-buy-btn"
          onClick={() => handleBuy()}
          disabled={isBuyRunning ? true : false}
        >
          {isBuyRunning ? "Buying" : "Buy"}
        </Button>
        <Button
          style={{
            backgroundColor: "red",
            borderColor: "red",
            fontWeight: "600",
            width: "85px",
            fontSize: "20px",
          }}
          className="manual-sell-btn"
          onClick={() => handleSell()}
          disabled={isSellRunning ? true : false}
        >
          {isSellRunning ? "Selling" : "Sell"}
        </Button>
      </div>
    </div>
  );
};

export default Manual;
