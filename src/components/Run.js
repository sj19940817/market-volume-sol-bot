import React from "react";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from "axios";

const Run = (props) => {
    const [isRunning, setRunning] = useState(false);
    const API_URL = 'http://localhost:8080/'
    const tokenaddress = props.tokenaddress
    // useEffect(() => {
    //     function simulateNetworkRequest() {
    //       return new Promise((resolve) => setTimeout(resolve, 2000));
    //     }
    
    //     if (isRunning) {
    //       simulateNetworkRequest().then(() => {
    //         setRunning(false);
    //       });
    //     }
    //   }, [isRunning]);

      // const handleClickStart = async () => {
      //   const data = await axios.get(API_URL)
      //   setRunning(true);
      // }

      const handleClickStart = async () => {
        try {
          const res = await axios.get(
            API_URL,
            {
              params: {
                tokenaddress: tokenaddress,
              },
            }
          );
          console.log(res.data);
        } catch (err) {
          console.log("error")
        }
        };
      const handleClickStop = () => {
        setRunning(false)
      }
    return (
        <Button
        variant={isRunning ? 'danger' : 'primary'}
        onClick={!isRunning ? handleClickStart : handleClickStop}
        style={{marginTop: '0', width: '160px', height: '54px', fontSize: '25px'}}
        >
         {isRunning ? 'Stop Bot' : 'Start Bot'}
        </Button>
    )
}

export default Run