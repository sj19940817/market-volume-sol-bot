import React from "react";
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Logo from '../assets/Magic200.png'

const Nav = () => {
    return (
<Navbar className="bg-body-tertiary">
    <Container>
          <Navbar.Brand style={{display:"flex",justifyContent:"flex-start",alignItems: 'center'}}>
            <div style={{margin: '0 10px 0 10px'}}>
                <img
                alt=""
                src={Logo}
                width={50}
                height={50}
                className="d-inline-block align-top"
                />
            </div>
            <div><h1 style={{color: '#ffffff'}}>Solana Market Volume Bot</h1></div>
          </Navbar.Brand>
          </Container>
      </Navbar>
    )
}

export default Nav