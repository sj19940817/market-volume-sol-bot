import React, { useState, useEffect } from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Run from "./Run";
import './Setting.css'


const Setting = () => {
    const [tokenaddress, setTokenaddress] = useState('')
    const [maxVal, setMaxVal] = useState(0);
    const [minVal, setMinVal] = useState(0);
    const [timestamp, setTimestamp] = useState(0);
    const [option, setOption] = useState('');

    return(
        <div className="setting">
            {/* buy sell option */}
            <div className="buy-sell-option">
                <Form>
                    <Form.Check
                        inline
                        label="Buy"
                        name="group1"
                        type="radio"
                        id={`inline-radio-1`}
                        onChange={() => setOption('buy')}
                        value={option}
                    />
                    <Form.Check
                        inline
                        label="Sell"
                        name="group1"
                        type="radio"
                        id={`inline-radio-2`}
                        onChange={() => setOption('sell')}
                        value={option}
                    />
                </Form>
            </div>
            {/*Token address  */}
            <div className="tokenaddr">
                <InputGroup size="lg" className="inputgroup">
                    <InputGroup.Text id="inputGroup-sizing-lg">Token Address</InputGroup.Text>
                    <Form.Control
                    aria-label="Large"
                    aria-describedby="inputGroup-sizing-sm"
                    placeholder="HLptm5e6rTgh4EKgDpYFrnRHbjpkMyVdEeREEa2G7rf9"
                    value={tokenaddress}
                    onChange={e => setTokenaddress(e.target.value)}
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
                        value={maxVal}
                        onChange={e => setMaxVal(e.target.value)}
                        />
                        <InputGroup.Text>{option == 'buy' ? 'SOL' : 'Tokens'}</InputGroup.Text>
                    </InputGroup>
                    <InputGroup size="lg" className="minval">
                        <InputGroup.Text id="inputGroup-sizing-lg">Min</InputGroup.Text>
                        <Form.Control
                        aria-label="Large"
                        aria-describedby="inputGroup-sizing-sm"
                        type="number"
                        placeholder="0"
                        value={minVal}
                        onChange={e => setMinVal(e.target.value)}
                        />
                        <InputGroup.Text>{option == 'buy' ? 'SOL' : 'Tokens'}</InputGroup.Text>
                    </InputGroup>
                </div>
                {/* Button */}
                <div className="run-btn"> 
                    <Run tokenaddress={tokenaddress} maxVal={maxVal} minVal={minVal} timestamp={timestamp} option={option}/>
                </div>
            </div>
            {/* Timestamp */}
            <div className="time">
                <InputGroup className="mb-3 timestamp">
                    <InputGroup.Text id="inputGroup-sizing-lg">TimeStamp</InputGroup.Text>
                    <Form.Control placeholder="0"  type="number" value={timestamp}
                        onChange={e => setTimestamp(e.target.value)} />
                    <InputGroup.Text id="inputGroup-sizing-lg">S</InputGroup.Text>
                </InputGroup>
            </div>
        </div>
    )
}

export default Setting