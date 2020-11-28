import React, { useState, useContext, useEffect } from 'react'
import { Container, Row, Col, Carousel, Card, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import jwt_decode from 'jwt-decode'
import { Redirect } from 'react-router-dom'

import { GlobalContext } from '../../context/GlobalContext'

export default function Home() {
  const { products, stalls, isAuthenticated, addProductToBill } = useContext(GlobalContext)

  let token = localStorage.getItem('token')
  let isAdmin;
  if (token) {
    let user = jwt_decode(token)
    let { role } = user
    isAdmin = role == 'admin' ? true : false
  }

  const [index, setIndex] = useState(0)
  const [stall, setStall] = useState('')

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }

  const addProduct = id => {
    if (!isAuthenticated) {
      toast.warn('You must login to add product!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      addProductToBill(id)
    }
  }

  return (
    isAdmin ? <Redirect to='/admin' /> : <>
      <Carousel activeIndex={index} onSelect={handleSelect} interval={3000}>
        <Carousel.Item className="carousel">
          <img
            className="image-slide carousel-image"
            src="https://i.pinimg.com/originals/82/dd/96/82dd96cd0aa099f021c42e88af818924.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item className="carousel">
          <img
            className="image-slide carousel-image"
            src="https://employer.jobsgo.vn/uploads/media/img/201712/pictures_library_7381_20171216083149_9831.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item className="carousel">
          <img
            className="image-slide carousel-image"
            src="https://zozotea.com/wp-content/uploads/back-to-school-banner.jpg"
            alt="Third slide"
          />
        </Carousel.Item>
      </Carousel>

      <Row>
        <Col className="category-header">Uống gì hôm nay?</Col>
      </Row>

      <Container>
      {
        !!stall ? <>
          <Link className="back-button" onClick={() => setStall('')}>
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Trở lại
          </Link>
          {products ? <Row className="mt-3">
            {products.filter(product => {
              if (stall)
                return product.stall === stall
              else
                return product
            }).map((product, id) => {
              return <Col md={3} xs={6}>
                <Card className="card-size" style={{ margin: 'auto', cursor: 'pointer' }}>
                  <Card.Img className="card-img" variant="top" src={`/images/${product.image}`} />
                  <Card.Body>
                    <Card.Title className="card-title">{product.name}</Card.Title>
                    <Card.Text>{product.price} VNĐ</Card.Text>
                    <Button className="mt-auto add-to-cart" onClick={() => addProduct(product._id)} variant="primary">Mua ngay</Button>
                  </Card.Body>
                </Card>
              </Col>
            })}
          </Row> : <h3>Loading...</h3>}
        </> : <Row>
            {stalls ? stalls.map(stall => {
              return <Col md={3} xs={6}>
                <Card onClick={() => setStall(stall._id)} style={{ margin: 'auto', cursor: 'pointer' }}>
                  <Card.Img className="card-img" variant="top" src={`/images/${stall.image}`} />
                  <Card.Body className="pb-0">
                    <Card.Title>{stall.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            }) : <Spinner animation="border" />}
          </Row>
      }
      </Container>
      

      <Row>
        <Col style={{ margin: "8px 16px 4px", padding: "8px", backgroundColor: "rgb(20, 120, 130)", textAlign: 'center' }}>
          <Button><Link style={{ color: 'rgb(255, 255, 255)' }} to='/checkout'>Checkout</Link></Button>
        </Col>
      </Row>
    </>
  )
}
