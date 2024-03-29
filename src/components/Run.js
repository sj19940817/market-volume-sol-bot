import React from "react";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

const Run = () => {
    const [isRunning, setRunning] = useState(false);

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

      const handleClickStart = () => {
        
        setRunning(true);
      }
      const handleClickStop = () => {
        setRunning(false)
      }
    return (
        <Button
        variant={isRunning ? 'danger' : 'primary'}
        // disabled={isRunning}
        onClick={!isRunning ? handleClickStart : handleClickStop}
        style={{marginTop: '0', width: '160px', height: '54px', fontSize: '25px'}}
        >
         {isRunning ? 'Stop Bot' : 'Start Bot'}
        </Button>
    )
}

export default Run