import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Carousel, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode';
import { Redirect } from 'react-router-dom';
import SearchBox from '../search-box/search-box';
import { GlobalContext } from '../../context/GlobalContext';
import accents from 'remove-accents';


const Search = () => {
  const { products, stalls, isAuthenticated, addProductToBill } = useContext(GlobalContext);
  let token = localStorage.getItem('token')
  let isAdmin;
  if (token) {
    let user = jwt_decode(token)
    let { role } = user
    isAdmin = role == 'admin' ? true : false
  }
  const [index, setIndex] = useState(0);
  const [stall, setStall] = useState('');
  const [searchField, setSearchField] = useState('search');

  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }

  const onSearchChange = event => {
    if (event.target.value === '') {
      setSearchField('search');
    } else {
      setSearchField(event.target.value);
    }
  }
  debugger;
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
    
    <React.Fragment>
      <Container className="search">
      <SearchBox onChange={onSearchChange} />
      {
        !stall ? <>
          <Link className="back-button" to="/">
            <svg width="1em" height="1em" viewBox="0 0 16 16" class="bi bi-chevron-left" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Trở lại
          </Link>
          {
            products ?
              <Row className="mt-3">
                {
                  products.filter(product => {
                    if (stall)
                      return product.stall == stall
                    else
                      return product
                  })
                    .filter((product, idx) => accents.remove(product.name.toLowerCase()).includes(accents.remove(searchField.toLowerCase())))
                    .map((product, idx) => {
                      return <Col className="mb-4" md={3} xs={6} key={idx}>
                        <Card className="card-size card-item">
                          <Card.Img className="card-img" style={{ minHeight: '200px', maxHeight: '200px' }} variant="top" src={`/images/${product.image}`} />
                          <Card.Body>
                            <Card.Title className="card-title">{product.name}</Card.Title>
                            <div className="rating">
                              <i class="fas fa-star"></i>
                              <i class="fas fa-star"></i>
                              <i class="fas fa-star"></i>
                              <i class="fas fa-star"></i>
                              <i class="fas fa-star-half-alt"></i>
                            </div>
                            <Card.Text className="card-price">{product.price} VNĐ</Card.Text>
                            <Button className="mt-auto add-to-cart button-border" onClick={() => addProduct(product._id)} variant="primary">Mua ngay</Button>
                          </Card.Body>
                        </Card>
                      </Col>
                    })}
              </Row> : <h3>Loading...</h3>
          }
        </> : <Row>
            {!stalls ? stalls.map(stall => {
              return <Col md={3} xs={6}>
                <Card onClick={() => setStall(stall._id)} style={{ margin: 'auto', cursor: 'pointer' }}>
                  <Card.Img style={{ minHeight: '200px', maxHeight: '200px' }} variant="top" src={`/images/${stall.image}`} />
                  <Card.Body>
                    <Card.Title>{stall.name}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            }) : <Spinner animation="border" />}
          </Row>
      }
      </Container>
     
    </React.Fragment>
  )
}

export default Search;