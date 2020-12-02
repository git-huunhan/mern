import React from 'react'
import { Row, Col, Container, Button } from 'react-bootstrap'

export default function Footer() {
  return (
    <Col className="mb-0">
      <Row className="footer-line">
      </Row>
      <Container>
        <Row className="footer">
          <Col className="footer-left">
            <Col>
              Project created by FO Team with 
              <img className="ml-2 heart-logo" src="https://firebasestorage.googleapis.com/v0/b/dev-web-app-551e1.appspot.com/o/heart%201.svg?alt=media&token=16d5243d-3412-4329-a0ac-4d992ead2b0f" alt="heart"/>
              <br />From CTK41 - Dalat University
            </Col>
            
          </Col>
          <Col className="footer-right">
            <img className="team-logo" src="https://firebasestorage.googleapis.com/v0/b/dev-web-app-551e1.appspot.com/o/Group%2028.svg?alt=media&token=66ce2e9c-6b63-4bec-a38d-df113431928f" alt="team"/>
          </Col>
        </Row>
      </Container>
      
    </Col>
  )
}
