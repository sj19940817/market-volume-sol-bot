import React from "react";
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
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
                    />
                </InputGroup>
            </div>
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
            <div className="time">
                <InputGroup className="mb-3 timestamp">
                    <InputGroup.Text id="inputGroup-sizing-lg">TimeStamp</InputGroup.Text>
                    <Form.Control/>

                    <InputGroup.Text id="inputGroup-sizing-lg">S</InputGroup.Text>
                </InputGroup>
            </div>
        </div>
    )
}

export default Setting