import React from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Run from "./Run";
import './Setting.css'


const Setting = () => {
        return(
        <div className="setting">
            {/*Token address  */}
            <div className="tokenaddr">
                <InputGroup size="lg" className="inputgroup">
                    <InputGroup.Text id="inputGroup-sizing-lg">Token Address</InputGroup.Text>
                    <Form.Control
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    placeholder="HLptm5e6rTgh4EKgDpYFrnRHbjpkMyVdEeREEa2G7rf9"
                    />
                </InputGroup>
            </div>
            {/* Sol Max and Min value */}
            <div style={{display: 'flex'}}>
                <div className="max-min-val">
                    <InputGroup size="lg" className="maxval">
                        <InputGroup.Text id="inputGroup-sizing-lg">Max</InputGroup.Text>
                        <Form.Control
                        aria-label="Large"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        placeholder="0"
                        />
                        <InputGroup.Text>SOL</InputGroup.Text>
                    </InputGroup>
                    <InputGroup size="lg" className="minval">
                        <InputGroup.Text id="inputGroup-sizing-lg">Min</InputGroup.Text>
                        <Form.Control
                        aria-label="Large"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        placeholder="0"
                        />
                        <InputGroup.Text>SOL</InputGroup.Text>
                    </InputGroup>
                </div>
                {/* Button */}
                <div className="run-btn"> 
                    <Run />
                </div>
            </div>
            {/* Timestamp */}
            <div className="time">
                <InputGroup className="mb-3 timestamp">
                    <InputGroup.Text id="inputGroup-sizing-lg">TimeStamp</InputGroup.Text>
                    <Form.Control placeholder="0"/>
                    <InputGroup.Text id="inputGroup-sizing-lg">S</InputGroup.Text>
                </InputGroup>
            </div>
        </div>
    )
}

export default Setting