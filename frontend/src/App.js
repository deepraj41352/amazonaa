import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
import Home from './page/Home';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ProductSceen from './page/ProductSceen';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import { LinkContainer } from 'react-router-bootstrap';
import Badge from 'react-bootstrap/esm/Badge';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useContext, useEffect, useState } from 'react';
import { Store } from './Store';
import CartSceen from './page/CartSceen';
import ShippingAddressScereen from './page/ShippingAddressScereen';
import SignupScreen from './page/SignupScreen';
import SigninScreen from './page/SigninScreen';
import PaymentMethodScreen from './page/PaymentMethodScreen';
import PlaceOderScreen from './page/PlaceOderScreen';
import OrderScreen from './page/OrderScreen';
import OrderHistoryScreen from './page/OrderHistoryScreen';
import ProfileScreen from './page/ProfileScreen';
import { Button } from 'react-bootstrap';
import { getError } from './Utils';
import axios from 'axios';
import SearchBox from './component/SearchBox';
import SearchScreen from './page/SearchScreen';
import ProtectedRoute from './component/ProtectedRoute';
import AdminRoute from './component/AdminRoute';
import DashbordScreen from './page/DashbordScreen';
import ProductListScreen from './page/ProductListScreen';
import ProductEditScreen from './page/ProductEditScreen';
import OrderListScreen from './page/OrderListScreen';
import UserListScreen from './page/UserListScreen';
import UserEditSreen from './page/UserEditSreen';
import MapScreen from './page/MapScreen';
import ForgetPasswordScreen from './page/ForgetPasswordScreen ';
import ResetPasswordScreen from './page/ResetPasswordScreen ';
import DemoGrid from './component/demoGrid';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { fullBox, userInfo, cart } = state;

  const singoutHandler = () => {
    ctxDispatch({ type: 'USER_SIGNOUT' });
    localStorage.removeItem('userInfo');
    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('paymentMethod');
    window.location.href = '/signin';
  };

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`/api/products/categories`);
        setCategories(data);
      } catch (err) {
        toast.error(getError(err));
      }
    };
    fetchCategories();
  }, []);
  return (
    <BrowserRouter>
      <div
        className={
          sidebarIsOpen
            ? fullBox
              ? 'site-container active-cont d-flex flex-column full-box'
              : 'site-container active-cont d-flex flex-column'
            : fullBox
            ? 'site-container d-flex flex-column full-box'
            : 'site-container d-flex flex-column'
        }
      >
        <ToastContainer position="bottom-center" limit={1} />
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <Button
                variant="dark"
                onClick={() => setSidebarIsOpen(!sidebarIsOpen)}
              >
                <img src="/image/logo.jpg" alt="image" className="logoimage" />
              </Button>
              <LinkContainer to="/">
                <Navbar.Brand>AmaZona</Navbar.Brand>
              </LinkContainer>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="basic-navbar-nav">
                <SearchBox />
                <Nav className="me-auto w-100 justify-content-end">
                  <Link to="/cart" className="nav-link">
                    Cart
                    {cart.cartItems.length > 0 && (
                      <Badge pill bg="danger">
                        {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                      </Badge>
                    )}
                  </Link>
                  {userInfo ? (
                    <NavDropdown title={userInfo.name} id="basic-nav-dropdown">
                      <LinkContainer to="/profile">
                        <NavDropdown.Item>User profile</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/orderhistry">
                        <NavDropdown.Item>Order History</NavDropdown.Item>
                      </LinkContainer>
                      <NavDropdown.Divider />
                      <Link
                        className="dropdown-item"
                        to="#signout"
                        onClick={singoutHandler}
                      >
                        Sign Out
                      </Link>
                    </NavDropdown>
                  ) : (
                    <Link className="nav-link" to="/signin">
                      Sign In
                    </Link>
                  )}
                  {userInfo && userInfo.isAdmin && (
                    <NavDropdown title="Admin" id="admin-nav-dropdown">
                      <LinkContainer to="/admin/dashbord">
                        <NavDropdown.Item>Dashbord</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/productlist">
                        <NavDropdown.Item>Products</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/orders">
                        <NavDropdown.Item>Order</NavDropdown.Item>
                      </LinkContainer>
                      <LinkContainer to="/admin/users">
                        <NavDropdown.Item>Users</NavDropdown.Item>
                      </LinkContainer>
                    </NavDropdown>
                  )}
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </header>
        <div
          className={
            sidebarIsOpen
              ? 'active-nav side-navbar d-flex justify-content-between flex-wrap flex-column'
              : 'side-navbar d-flex justify-content-between flex-wrap flex-column'
          }
        >
          <Nav className="flex-column text-white w-100 p-3">
            <Nav.Item>
              <strong>Categories</strong>
            </Nav.Item>

            {categories.map((c) => (
              <li key={c} className="sitebarC">
                <Link
                  to={`/search?category=${c}`}
                  onClick={() => setSidebarIsOpen(false)}
                >
                  {c}
                </Link>
              </li>
            ))}
          </Nav>
        </div>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/product/:slug" element={<ProductSceen />} />
              <Route path="/cart" element={<CartSceen />} />
              <Route path="/search" element={<SearchScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/signup" element={<SignupScreen />} />
              <Route
                path="/forget-password"
                element={<ForgetPasswordScreen />}
              />
              <Route
                path="/reset-password/:token"
                element={<ResetPasswordScreen />}
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfileScreen />
                  </ProtectedRoute>
                }
              />

              <Route path="/shipping" element={<ShippingAddressScereen />} />
              <Route path="/payment" element={<PaymentMethodScreen />} />
              <Route path="/placeorder" element={<PlaceOderScreen />} />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute>
                    <OrderScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/map"
                element={
                  <ProtectedRoute>
                    <MapScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="orderhistry"
                element={
                  <ProtectedRoute>
                    <OrderHistoryScreen />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/product/:id"
                element={
                  <AdminRoute>
                    <ProductEditScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route
                path="/admin/user/:id"
                element={
                  <AdminRoute>
                    <UserEditSreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/dashbord"
                element={
                  <AdminRoute>
                    <DashbordScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/productlist"
                element={
                  <AdminRoute>
                    <ProductListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/orders"
                element={
                  <AdminRoute>
                    <OrderListScreen />
                  </AdminRoute>
                }
              ></Route>
              <Route
                path="/admin/users"
                element={
                  <AdminRoute>
                    <UserListScreen />
                  </AdminRoute>
                }
              ></Route>

              <Route path="/" element={<Home />} />
              <Route
                path="/admin/demo"
                element={
                  <AdminRoute>
                    <DemoGrid />
                  </AdminRoute>
                }
              ></Route>
            </Routes>
          </Container>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
