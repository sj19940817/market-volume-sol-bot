import React from "react";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import axios from "axios";

const Run = (props) => {
  const [isRunning, setRunning] = useState(false);
  const API_URL = "http://localhost:8080/";
  const tokenaddress = props.tokenaddress;
  const maxVal = props.maxVal;
  const minVal = props.minVal;
  const timestamp = props.timestamp;
  const option = props.option;

  const handleClickStart = async () => {
    if (!option) {
      alert("Please select Buy or Sell");
      return;
    }
    if (tokenaddress && maxVal && minVal && timestamp) {
      setRunning(true);
      try {
        const res = await axios.get(API_URL, {
          params: {
            tokenaddress: tokenaddress,
            maxVal: maxVal,
            minVal: minVal,
            timestamp: timestamp,
            option: option,
          },
        });
        console.log(res.data);
      } catch (err) {
        console.log("error");
      }
    } else {
      alert("Please complete all inputbox");
      setRunning(false);
    }
  };
  const handleClickStop = async () => {
    setRunning(false);
    try {
      const res = await axios.get(`${API_URL}`, {
        params: {
          stop: true,
        },
      });
      console.log(res.data);
    } catch (err) {
      console.log("error");
    }
  };
  return (
    <Button
      variant={isRunning ? "danger" : "primary"}
      onClick={!isRunning ? handleClickStart : handleClickStop}
      style={{
        marginTop: "0",
        width: "160px",
        height: "54px",
        fontSize: "25px",
      }}
    >
      {isRunning ? "Stop Bot" : "Start Bot"}
    </Button>
  );
};

export default Run;
