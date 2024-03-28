import React from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import './Setting.css'


const Setting = () => {
    return(
        <>
            {/*Token address  */}
            <InputGroup size="lg" className="inputgroup">
                <InputGroup.Text id="inputGroup-sizing-lg">Token Address</InputGroup.Text>
                <Form.Control
                aria-label="Large"
                aria-describedby="inputGroup-sizing-sm"
                />
            </InputGroup>
            {/* Sol Max and Min value */}
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
            {/* Timestamp */}
            

        </>
    )
}

export default Setting