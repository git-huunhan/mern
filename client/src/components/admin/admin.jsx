import React, { useContext, useState, useEffect, Fragment } from 'react';
import { Row, Col, Tabs, Tab, Table, Card, Button, Form, Modal } from 'react-bootstrap';
import { Redirect } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import axios from 'axios';
import { CSVLink, CSVDownload } from "react-csv";

import { GlobalContext } from '../../context/GlobalContext';

export default function Admin() {
  const { products, stalls, addNewStall, addNewProduct, bills, getBills, deleteProductWithId } = useContext(GlobalContext)
  // debugger;
  useEffect(() => {
    getBills()
  }, [])

  let token = localStorage.getItem('token')
  let isAdmin
  if (token) {
    let user = jwt_decode(token)
    let { role } = user
    isAdmin = role == 'admin' ? true : false
  }

  const [showNewProduct, setShowNewProduct] = useState(false)
  const [showNewStall, setShowNewStall] = useState(false)

  const handleCloseNewProduct = () => setShowNewProduct(false)
  const handleShowNewProduct = () => setShowNewProduct(true)
  const handleCloseNewStall = () => setShowNewStall(false)
  const handleShowNewStall = () => setShowNewStall(true)

  const [selectedStall, setSelectedStall] = useState('')

  const [name, setName] = useState('')
  const [price, setPrice] = useState(1)
  const [stall2, setStall2] = useState('');
  const [dateTime, setDatetime] = useState();
  const [selectedFile, setSelectedFile] = useState(null)

  const headers = [
    { label: "#", key: "number" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Product Ordered", key: "productOrdered" },
    { label: "DateTime Ordered", key: "createdAt" }
  ];

  const deleteProduct = (id) => {
    try {
      const res = axios.delete(`/api/products/${id}`);
      deleteProductWithId(id)
    } catch (err) {
      console.log(err)
    }
  }

  const newProduct = async () => {
    if (name && price && stall2 && selectedFile) {
      try {
        const data = new FormData()
        data.append('name', name)
        data.append('price', price)
        data.append('stall', stall2)
        data.append('photo', selectedFile)
        const res = await axios.post('/api/products', data)
        handleCloseNewProduct()
        setName('');
        setPrice(1);
        setStall2('');
        setSelectedFile(null);
        addNewProduct(res.data);
      } catch (err) {
        console.log(err)
      }
    } else {

    }
  }

  const newStall = async () => {
    if (name && selectedFile) {
      try {
        const data = new FormData();
        data.append('name', name);
        data.append('photo', selectedFile);
        const res = await axios.post('/api/products/stalls', data)
        handleCloseNewStall()
        setName('')
        setSelectedFile(null)
        addNewStall(res.data)
      } catch (err) {
        console.log(err)
      }
    }
  }

  const getProductById = id => {
    return products.find(product => product._id == id)
  }

  const getDateAndTime = (email, id) => {
    return bills
      .filter((item) => {
        return item.user.email === email && item._id === id
      })
      .map((bill, index) => {
        const date = new Date(bill.createdAt);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        const hour = date.getHours();
        const minutes = date.getMinutes();
        return day + "-" + month + "-" + year + "; " + hour + " giờ " + minutes + " phút";
      })
  }

  const getDateTimeDuplicates = () => {
    let result = bills.map((bill, index) => {
      const date = new Date(bill.createdAt);
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const hour = date.getHours();
      const minutes = date.getMinutes();
      return day + "-" + month + "-" + year + "; " + hour + " giờ " + minutes + " phút";
    })
    let unique = [...new Set(result)];
    return unique;
  }

  const getDateDuplicates = () => {
    let result = bills.map((bill, index) => {
      const validProductIds = Object.keys(bill.products).filter(getProductById);
      if (validProductIds.length === 0) {
        return '';
      } else {
        const date = new Date(bill.createdAt);
        const day = date.getDate();
        const month = date.getMonth();
        const year = date.getFullYear();
        return day + "-" + month + "-" + year;
      }
    })
    let unique = [...new Set(result)];
    // setDatetime(unique);
    return unique;
  }

  return (
    isAdmin ? <Row style={{ minHeight: '90vh', paddingTop: 56 }}>
      <Col>
        <Tabs defaultActiveKey="products">
          <Tab eventKey="products" title="Sản phẩm">
            <Form.Group style={{ margin: '8px 0 4px' }}>
              <Row>
                <div className="admin-button">
                  <Button className="header-logout button-border" onClick={handleShowNewProduct}>Thêm sản phẩm</Button>
                </div>
                <div className="admin-button">
                  <Button className="header-logout button-border" onClick={handleShowNewStall}>Thêm danh mục</Button></div>
                <div className="admin-button">
                  <Form.Control as="select" onChange={e => setSelectedStall(e.target.value)}>
                    <option value=''>Tất cả danh mục</option>
                    {stalls ? stalls.map((stall, index) => <option key={index} value={stall._id}>{stall.name}</option>) : ''}
                  </Form.Control>
                </div>
              </Row>
            </Form.Group>
            <Table striped bordered hover style={{ margin: '4px 0' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th></th>
                  <th>Tên sản phẩm</th>
                  <th>Giá tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.filter(product => {
                  if (!!selectedStall)
                    return product.stall == selectedStall
                  else
                    return product
                }).map((product, index) => {
                  return <tr key={index}>
                    <td>{index + 1}</td>
                    <td className="d-flex justify-content-center"> <Card.Img style={{ minWidth: '200px', maxWidth: '200px' }} variant="top" src={`/images/${product.image}`} /></td>
                    <td>{product.name}</td>
                    <td>{product.price} VNĐ</td>
                    <td>
                      <Button className="delete-button button-border" onClick={() => deleteProduct(product._id)}>
                        Xóa
                      </Button>
                    </td>
                  </tr>
                })}
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="bills" title="Đơn hàng">
            <Table striped bordered hover style={{ margin: '8px 0 4px' }}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tên khách hàng</th>
                  <th>Email</th>
                  <th>Sản phẩm</th>
                  <th>Thời gian đặt hàng</th>
                </tr>
              </thead>
              <tbody>
                {
                  bills ? bills.map((bill, index) => {
                    const validProductIds = Object.keys(bill.products).filter(getProductById)
                    if (validProductIds.length === 0) {
                      return null;
                    }
                    return (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{bill.user.name}</td>
                        <td>{bill.user.email}</td>
                        <td>
                          {
                            validProductIds.map((id, index) => {
                              return <div key={index}>{getProductById(id).name} x {bill.products[`${id}`]}</div>;
                            })
                          }
                        </td>
                        <td>{
                          getDateAndTime(bill.user.email, bill._id)
                        }</td>
                      </tr>
                    );
                  }) : ''
                }
              </tbody>
            </Table>
          </Tab>
          <Tab eventKey="report" title="Báo cáo">
            <div className='mt-5 ml-5'>
              <h3>Tải xuống báo cáo</h3>
              {
                getDateDuplicates().map((item, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: 'block'
                      }}
                    >
                      {/* <input
                        type="checkbox" name="checkbox" id="checkbox" /> */}
                      <CSVLink
                        filename={'report_sanpham.csv'}
                        className='ml-3 mt-3'
                        separator={";"}
                        data={
                          bills ? bills
                            .filter((bill, index) => {
                              const date = new Date(bill.createdAt);
                              const day = date.getDate();
                              const month = date.getMonth();
                              const year = date.getFullYear();
                              const dateBill = day + "-" + month + "-" + year;
                              return dateBill == item;
                            })
                            .map((bill, index) => {
                              const validProductIds = Object.keys(bill.products).filter(getProductById);
                              if (validProductIds.length === 0) {
                                return {
                                  number: index + 1,
                                  name: bill.user.name,
                                  email: bill.user.email,
                                  productOrdered: "sản phẩm này đã bị xóa, không tồn tại",
                                  createdAt: ""
                                }
                              }
                              else {
                                return {
                                  number: index + 1,
                                  name: bill.user.name,
                                  email: bill.user.email,
                                  productOrdered: validProductIds.map(e => {
                                    return `${getProductById(e).name} x ${bill.products[`${e}`]}`;
                                  }),
                                  createdAt: item
                                }
                              }
                            }) : ""
                        }
                        headers={headers}
                      > {
                          (item === '') ? null : `report-${item}`
                        }
                      </CSVLink>
                    </div>
                  )
                })
              }
              <div
                style={{
                  display: 'block'
                }}
              >
                {/* <input
                  type="checkbox" name="checkbox" id="checkbox" /> */}
                <CSVLink
                  filename={'report_sanpham.csv'}
                  separator={";"}
                  className='ml-3 mt-3'
                  data={
                    bills.map((bill, index) => {
                      return {
                        number: index + 1,
                        name: bill.user.name,
                        email: bill.user.email,
                        productOrdered: Object.keys(bill.products).map(e => {
                          if (typeof (getProductById(e)) === 'undefined') {
                            return '';
                          } else {
                            return `${getProductById(e).name} x ${bill.products[`${e}`]}`;
                          }
                        }),
                        createdAt: getDateAndTime(bill.user.email, bill._id)
                      }
                    })
                  }
                  headers={headers}
                >report all</CSVLink>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Col>

      <Modal show={showNewProduct} onHide={handleCloseNewProduct}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm sản phẩm mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control onChange={(e) => setName(e.target.value)} style={{ marginBottom: '12px' }} type="text" placeholder="Tên sản phẩm" />
            <Form.Control onChange={(e) => setPrice(e.target.value)} style={{ marginBottom: '12px' }} type="number" min={1} placeholder="Giá tiền" />
            <Form.Group>
              <Form.Control style={{ marginBottom: '12px' }} as="select" onChange={e => setStall2(e.target.value)}>
                <option value=''>Chọn danh mục cho sản phẩm</option>
                {stalls ? stalls.map((stall, index) => <option key={index} value={stall._id}>{stall.name}</option>) : ''}
              </Form.Control>
              <Form.File
                onChange={(e) => setSelectedFile(e.target.files[0])}
                id="" label="Chọn hình ảnh sản phẩm" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewProduct}>
            Hủy
          </Button>
          <Button className="header-logout" variant="primary" onClick={newProduct}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showNewStall} onHide={handleCloseNewStall}>
        <Modal.Header closeButton>
          <Modal.Title>Tạo danh mục mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Control onChange={(e) => setName(e.target.value)} style={{ marginBottom: '12px' }} type="text" placeholder="Tên danh mục" />
            <Form.Group>
              <Form.File onChange={(e) => setSelectedFile(e.target.files[0])} id="" label="Chọn hình ảnh danh mục" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseNewStall}>
            Hủy
          </Button>
          <Button className="header-logout" variant="primary" onClick={newStall}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>
    </Row> : <Redirect to='/' />
  )
}
