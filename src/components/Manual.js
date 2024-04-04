import React from "react";
import "./Manual.css";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";

const Manual = () => {
  return (
    <div className="manual">
      <p className="manual-title">Manual Override</p>
      <InputGroup size="lg" className="maxval" style={{ marginTop: "2em" }}>
        <Form.Control
          aria-label="Large"
          aria-describedby="inputGroup-sizing-sm"
          type="number"
          placeholder="0"
          //   value={maxVal}
          //   onChange={(e) => setMaxVal(e.target.value)}
        />
        <InputGroup.Text>SOL</InputGroup.Text>
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
        >
          Sell
        </Button>
      </div>
    </div>
  );
};

export default Manual;
