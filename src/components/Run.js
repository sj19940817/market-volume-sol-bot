import React from "react";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import axios from "axios";

const Run = (props) => {
    const [isRunning, setRunning] = useState(false);
    const API_URL = 'http://localhost:8080/'
    const tokenaddress = props.tokenaddress
    const maxSol = props.maxSol
    const minSol = props.minSol
    const timestamp = props.timestamp

      const handleClickStart = async () => {
        
        if(tokenaddress && maxSol && minSol && timestamp) {
          setRunning(true)
          try {
            const res = await axios.get(
              API_URL,
              {
                params: {
                  tokenaddress: tokenaddress,
                  maxSol: maxSol,
                  minSol: minSol,
                  timestamp: timestamp
                },
              }
            );
            console.log(res.data);
          } catch (err) {
            console.log("error")
          }
        } else {
          alert('Please complete all inputbox')
          setRunning(false)
          
        }
      };
      const handleClickStop = async () => {
        setRunning(false)
        try {
          const res = await axios.get(
            `${API_URL}`,
            {
              params: {
                stop: true,
              },
            }
          );
          console.log(res.data);
        } catch (err) {
          console.log("error")
        }
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