// import React, { useContext, useEffect, useReducer, useState } from 'react';
// import LoadingBox from '../component/LoadingBox';
// import MessageBox from '../component/MessageBox';
// import { Link, useLocation, useNavigate } from 'react-router-dom';
// import { Store } from '../Store';
// import axios from 'axios';
// import { Button, Col, Nav, Row } from 'react-bootstrap';
// import { toast } from 'react-toastify';
// import { getError } from '../Utils';
// import {
//   DataGrid,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
// } from '@mui/x-data-grid';
// import SearchBar from 'material-ui-search-bar';
// import { Grid } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return {
//         ...state,
//         products: action.payload.products,
//         page: action.payload.page,
//         pages: action.payload.pages,
//         loading: false,
//       };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };

//     case 'CREATE_REQUEST':
//       return { ...state, loadingCreate: true };
//     case 'CREATE_SUCCESS':
//       return {
//         ...state,
//         loadingCreate: false,
//       };
//     case 'CREATE_FAIL':
//       return { ...state, loadingCreate: false };
//     case 'DELETE_REQUEST':
//       return { ...state, loadingDelete: true, successDelete: false };
//     case 'DELETE_SUCCESS':
//       return {
//         ...state,
//         loadingDelete: false,
//         successDelete: true,
//       };
//     case 'DELETE_FAIL':
//       return { ...state, loadingDelete: false, successDelete: false };

//     case 'DELETE_RESET':
//       return { ...state, loadingDelete: false, successDelete: false };
//     default:
//       return state;
//   }
// };

// const CustomToolbar = (props) => (
//   <div>
//     <GridToolbarContainer>
//       <GridToolbarColumnsButton />
//     </GridToolbarContainer>
//     <SearchBar {...props} />
//   </div>
// );

// export default function ProductListScreen() {
//   const [
//     {
//       loading,
//       error,
//       products,
//       pages,
//       loadingCreate,
//       loadingDelete,
//       successDelete,
//     },
//     dispatch,
//   ] = useReducer(reducer, {
//     loading: true,
//     error: '',
//   });

//   const [searchText, setSearchText] = useState('');
//   const [rowData, setrowData] = useState([]);
//   const [columns] = useState([
//     { field: '_id', headerName: 'ID', width: 200 },
//     { field: 'name', headerName: 'Name', width: 120 },
//     { field: 'price', headerName: 'Price', width: 120 },
//     { field: 'category', headerName: 'Category', width: 120 },
//     { field: 'brand', headerName: 'Brand', width: 120 },
//     {
//       field: '',
//       headerName: 'ACTIONS',
//       width: 100,
//       renderCell: (params) => {
//         return (
//           <Grid item xs={8}>
//             <Button
//               type="button"
//               variant="light"
//               onClick={() => navigate(`/admin/product/${params.id}`)}
//             >
//               Edit
//             </Button>
//             &nbsp;
//             <DeleteIcon
//               onClick={() => {
//                 deleteHandler(params.id);
//               }}
//             />
//           </Grid>
//         );
//       },
//     },
//   ]);

//   const navigate = useNavigate();
//   const { search } = useLocation();
//   const sp = new URLSearchParams(search);
//   const page = sp.get('page') || 1;

//   const { state } = useContext(Store);
//   const { userInfo } = state;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const { data } = await axios.get(`/api/products`, {
//           headers: { Authorizattion: `Bearer ${userInfo.token}` },
//         });
//         setrowData(data.products);
//         dispatch({ type: 'FETCH_SUCCESS', payload: data });
//       } catch (err) {}
//     };
//     if (successDelete) {
//       dispatch({ type: 'DELETE_RESET' });
//     } else {
//       fetchData();
//     }
//   }, [page, userInfo, successDelete]);

//   const createHandler = async () => {
//     if (window.confirm('Are you sure to create?')) {
//       try {
//         dispatch({ type: 'CREATE_REQUEST' });
//         const { data } = await axios.post(
//           '/api/products',
//           {},
//           {
//             headers: { Authorizattion: `Bearer ${userInfo.token}` },
//           }
//         );
//         toast.success('product created successfully');
//         dispatch({ type: 'CREATE_SUCCESS' });
//         navigate(`/admin/product/${data.product._id}`);
//       } catch (err) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'CREATE_FAIL',
//         });
//       }
//     }
//   };
//   const deleteHandler = async (product) => {
//     if (window.confirm('Are you sure to delete?')) {
//       try {
//         await axios.delete(`/api/products/${product._id}`, {
//           headers: { Authorizattion: `Bearer ${userInfo.token}` },
//         });
//         toast.success('product deleted successfully');
//         dispatch({ type: 'DELETE_SUCCESS' });
//         navigate('/admin/productlist');
//       } catch (err) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'DELETE_FAIL',
//         });
//       }
//     }
//   };

//   const requestSearch = (searchValue) => {
//     const searchRegex = new RegExp(`.*${searchValue}.*`, 'ig');
//     const filteredRows = products.filter((o) => {
//       return Object.keys(o).some((k) => {
//         return searchRegex.test(o[k].toString());
//       });
//     });
//     setrowData(filteredRows);
//   };

//   const cancelSearch = () => {
//     setSearchText('');
//     requestSearch(searchText);
//   };

//   return (
//     <div className="site-container active-cont d-flex flex-column full-box">
//       <div className="active-nav side-navbar d-flex justify-content-between flex-wrap flex-column side-top">
//         <Nav className="flex-column text-white w-120 p-3">
//           {userInfo && userInfo.isAdmin && (
//             <div>
//               <h3>Dashbord</h3>
//               <li>
//                 <Link to="/admin/dashbord">Home</Link>
//               </li>
//               <li>
//                 <Link to="/admin/productlist">Product</Link>
//               </li>
//               <li>
//                 <Link to="/admin/orders">Order</Link>
//               </li>
//               <li>
//                 <Link to="/admin/users">Users</Link>
//               </li>
//             </div>
//           )}
//         </Nav>
//       </div>
//       <Row>
//         <Col>
//           <h1>Products</h1>
//         </Col>
//         <Col className="col text-end">
//           <div>
//             <Button type="button" onClick={createHandler}>
//               Create Product
//             </Button>
//           </div>
//         </Col>
//       </Row>

//       {loadingCreate && <LoadingBox></LoadingBox>}

//       {loading ? (
//         <LoadingBox></LoadingBox>
//       ) : error ? (
//         <MessageBox variant="danger">{error}</MessageBox>
//       ) : (
//         <>
//           <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
//             <DataGrid
//               components={{ Toolbar: CustomToolbar }}
//               rows={rowData}
//               columns={columns}
//               getRowId={(row) => row._id}
//               initialState={{
//                 pagination: {
//                   paginationModel: { page: 0, pageSize: 5 },
//                 },
//               }}
//               componentsProps={{
//                 toolbar: {
//                   value: searchText,
//                   onChange: (searchVal) => requestSearch(searchVal),
//                   onCancelSearch: () => cancelSearch(),
//                 },
//               }}
//               pageSizeOptions={[5, 10, 100]}
//               checkboxSelection
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
