import axios from 'axios';
import React, { useContext, useEffect, useReducer } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Card, Col, ListGroup, Row } from 'react-bootstrap';
import LoadingBox from '../component/LoadingBox';
import MessageBox from '../component/MessageBox';
import { Store } from '../Store';
import { getError } from '../Utils';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

function reducer(state, action) {
  switch (action.type) {
    case 'FETCH_REQUEST':
      return { ...state, loading: true, error: '' };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, order: action.payload, error: '' };
    case 'FETCH_FAIL':
      return { ...state, loading: false, error: action.payload };
    case 'PAY_REQUEST': {
      return { ...state, loadingPay: true };
    }
    case 'PAY_SUCCESS': {
      return { ...state, loadingPay: false, successPay: true };
    }
    case 'PAY_FAIL': {
      return { ...state, loadingPay: false, successPay: false };
    }
    case 'DELIVER_REQUEST':
      return { ...state, loadingDeliver: true };
    case 'DELIVER_SUCCESS':
      return { ...state, loadingDeliver: false, successDeliver: true };
    case 'DELIVER_FAIL':
      return { ...state, loadingDeliver: false };
    case 'DELIVER_RESET':
      return {
        ...state,
        loadingDeliver: false,
        successDeliver: false,
      };
    case 'SPAY_REQUEST':
      return { ...state, loading: true };
    case 'SPAY_SUCCESS':
      return {
        ...state,
        loading: false,
        // order: action.payload,
        successStripePay: true,
      };
    case 'SPAY_FAIL':
      return { ...state, loading: false };
    case 'StripePay_RESET':
      return {
        ...state,
        loading: false,
        successStripePay: false,
      };
    default:
      return state;
  }
}

export default function OrderScreen() {
  const { state } = useContext(Store);

  const { userInfo } = state;

  const params = useParams();
  const { id: orderId } = params;

  const navigate = useNavigate();
  const [
    {
      loading,
      error,
      order,
      successPay,
      loadingPay,
      loadingDeliver,
      successDeliver,
      successStripePay,
    },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: '',
    order: {},
    successPay: false,
    loadingPay: false,
    // successStripePay: false,
  });

  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  function createOrder(data, action) {
    return action.order
      .create({
        purchase_units: [{ amount: { value: order.totalPrice } }],
      })
      .then((orderID) => {
        return orderID;
      });
  }

  function onApprove(data, action) {
    return action.order.capture().then(async function (details) {
      try {
        dispatch({ type: 'PAY_REQUEST' });
        const { data } = await axios.put(
          `/api/orders/${order._id}/pay`,
          details,
          { headers: { authorizattion: `Bearer ${userInfo.token}` } }
        );
        dispatch({ type: 'PAY_SUCCESS', payload: data });
        toast.success('Order is paid');
      } catch (err) {
        dispatch({ type: 'PAY_FAIL', payload: getError(err) });
        toast.error(getError(err));
      }
    });
  }
  function onError(err) {
    toast.error(getError(err));
  }

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        dispatch({ type: 'FETCH_REQUEST' });
        const { data } = await axios.get(`/api/orders/${orderId}`, {
          headers: { authorizattion: `Bearer ${userInfo.token}` },
        });
        dispatch({ type: 'FETCH_SUCCESS', payload: data });
      } catch (err) {
        dispatch({ type: 'FETCH_FAIL', payload: getError(err) });
      }
    };

    if (!userInfo) {
      return navigate('/login');
    }
    if (
      !order._id ||
      successPay ||
      successDeliver ||
      successStripePay ||
      (order._id && order._id !== orderId)
    ) {
      console.log('LOAD from IF');
      fetchOrder();
      if (successPay) {
        dispatch({ type: 'PAY_RESET' });
      }
      if (successDeliver) {
        dispatch({ type: 'DELIVER_RESET' });
      }
      if (successStripePay) {
        dispatch({ type: 'StripePay_RESET' });
      }
    } else {
      console.log('LOAD from Else');
      const loadPaypalScript = async () => {
        const { data: clientId } = await axios.get('/api/keys/paypal', {
          headers: { authorizattion: `Bearer ${userInfo.token}` },
        });
        paypalDispatch({
          type: 'resetOptions',
          value: { 'client-id': clientId, currency: 'USD' },
        });
        paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
      };
      loadPaypalScript();
    }
  }, [
    order,
    userInfo,
    orderId,
    navigate,
    paypalDispatch,
    successPay,
    successDeliver,
    successStripePay,
  ]);

  const deliverOrderHandler = async () => {
    try {
      dispatch({ type: 'DELIVER_REQEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/deliver`,
        {},
        { headers: { authorizattion: `Bearer ${userInfo.token}` } }
      );
      dispatch({ type: 'DELIVER_SUCCESS', payload: data });
      toast.success('Order is delivered');
    } catch (err) {
      toast.error(getError(err));
      dispatch({ type: 'DELIVER_FAIL' });
    }
  };

  const handalPaid = async () => {
    try {
      dispatch({ type: 'SPAY_REQUEST' });
      const { data } = await axios.put(
        `/api/orders/${order._id}/stripePaid`,
        {},
        {
          headers: { authorizattion: `Bearer ${userInfo.token}` },
        }
      );
      dispatch({ type: 'SPAY_SUCCESS', payload: data });

      toast.success('Order is paid');
    } catch (err) {
      dispatch({ type: 'SPAY_FAIL', payload: getError(err) });
      toast.error(getError(err));
    }
  };

  return loading ? (
    <LoadingBox></LoadingBox>
  ) : error ? (
    <MessageBox variant="danger">{error}</MessageBox>
  ) : (
    <div>
      <Helmet>
        <title>Order {orderId}</title>
      </Helmet>
      <h1>Order {orderId}</h1>
      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order</Card.Title>
              <Card.Text>
                <strong>Name:</strong>
                {order.shippingAddress.fullName}
                <br />
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
                &nbsp;
                {order.shippingAddress.location &&
                  order.shippingAddress.location.lat && (
                    <a
                      target="_new"
                      href={`https://maps.google.com?q=${order.shippingAddress.location.lat},${order.shippingAddress.location.lng}`}
                    >
                      Show On Map
                    </a>
                  )}
              </Card.Text>
              {order.isDelivered ? (
                <MessageBox variant="success">
                  Delivered at {order.deliveredAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Delivered</MessageBox>
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Payment</Card.Title>
              <Card.Text>
                <strong>Method:</strong> {order.paymentMethod}
              </Card.Text>
              {order.isPaid || order.iscasepaid ? (
                <MessageBox variant="success">
                  Paid at {order.paidAt}
                </MessageBox>
              ) : (
                <MessageBox variant="danger">Not Paid</MessageBox>
              )}
              {order.iscase ? (
                <MessageBox variant="success">case on delivery</MessageBox>
              ) : (
                ''
              )}
            </Card.Body>
          </Card>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Items</Card.Title>

              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row className="align-items-center">
                    <Col md={4}>Name</Col>
                    <Col md={4}>Quantity</Col>
                    <Col md={4}>Price</Col>
                  </Row>
                </ListGroup.Item>
                {order.orderItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="align-items-center">
                      <Col md={4}>
                        <img
                          src={item.image}
                          alt={item.name}
                          className="img-fluid rounded img-thumbnail"
                        />{' '}
                        <Link to={`/product/${item.slug}`}>{item.name}</Link>
                      </Col>
                      <Col md={4}>
                        <span>{item.quantity}</span>
                      </Col>
                      <Col md={4}>${item.price}</Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Order Summary</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <Row>
                    <Col>Item</Col>
                    <Col>${order.itemsPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>
                      <strong>Order Total</strong>
                    </Col>
                    <Col>${order.totalPrice.toFixed(2)}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && order.paymentMethod === 'PayPal' && (
                  <ListGroup.Item>
                    {isPending ? (
                      <LoadingBox />
                    ) : (
                      <div>
                        <PayPalButtons
                          createOrder={createOrder}
                          onApprove={onApprove}
                          onError={onError}
                        ></PayPalButtons>
                      </div>
                    )}
                    {loadingPay && <LoadingBox></LoadingBox>}
                  </ListGroup.Item>
                )}
                {!order.isPaid && order.paymentMethod === 'Stripe' && (
                  <ListGroup.Item>
                    <div className="d-grid">
                      <Button onClick={handalPaid}>Paid on Delivery</Button>
                    </div>
                  </ListGroup.Item>
                )}
                {(userInfo.isAdmin && order.isPaid && !order.isDelivered) ||
                  (order.iscase && userInfo.isAdmin && (
                    <ListGroup.Item>
                      {loadingDeliver && <LoadingBox></LoadingBox>}
                      <div className="d-grid">
                        <Button type="button" onClick={deliverOrderHandler}>
                          Deliver Order
                        </Button>
                      </div>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
