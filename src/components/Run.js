import React from "react";
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';

const Run = () => {
    const [isRunning, setRunning] = useState(false);

    useEffect(() => {
        function simulateNetworkRequest() {
          return new Promise((resolve) => setTimeout(resolve, 2000));
        }
    
        if (isRunning) {
          simulateNetworkRequest().then(() => {
            setRunning(false);
          });
        }
      }, [isRunning]);

      const handleClick = () => setRunning(true);
    return (
        <Button
        variant="danger"
        disabled={isRunning}
        onClick={!isRunning ? handleClick : null}
        style={{marginTop: '0', width: '160px', height: '54px', fontSize: '25px'}}
        >
         {isRunning ? 'Running…' : 'Start'}
        </Button>
    )
}

export default Run