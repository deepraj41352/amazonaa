// import React, { useContext, useEffect, useReducer, useState } from 'react';
// import { Helmet } from 'react-helmet-async';
// import LoadingBox from '../component/LoadingBox';
// import MessageBox from '../component/MessageBox';
// import { Store } from '../Store';
// import axios from 'axios';
// import { getError } from '../Utils';
// import { Button, Nav } from 'react-bootstrap';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import DeleteIcon from '@mui/icons-material/Delete';
// import {
//   DataGrid,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
// } from '@mui/x-data-grid';
// import SearchBar from 'material-ui-search-bar';
// import { Grid } from '@mui/material';

// const reducer = (state, action) => {
//   switch (action.type) {
//     case 'FETCH_REQUEST':
//       return { ...state, loading: true };
//     case 'FETCH_SUCCESS':
//       return {
//         ...state,
//         users: action.payload,
//         loading: false,
//       };
//     case 'FETCH_FAIL':
//       return { ...state, loading: false, error: action.payload };
//     case 'DELETE_REQUEST':
//       return { ...state, loadingDelete: true, successDelete: false };
//     case 'DELETE_SUCCESS':
//       return {
//         ...state,
//         loadingDelete: false,
//         successDelete: true,
//       };
//     case 'DELETE_FAIL':
//       return { ...state, loadingDelete: false };
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
// export default function UserListScreen() {
//   const navigate = useNavigate();
//   const [{ loading, error, users, successDelete }, dispatch] = useReducer(
//     reducer,
//     {
//       loading: true,
//       error: '',
//     }
//   );
//   const [searchText, setSearchText] = useState('');
//   const [rowData, setrowData] = useState(users);
//   const [columns] = useState([
//     { field: '_id', headerName: 'ID', width: 200 },
//     { field: 'name', headerName: 'Name', width: 150 },
//     { field: 'email', headerName: 'EMAIL', width: 150 },
//     { field: 'isAdmin', headerName: 'IS ADMIN', width: 150 },

//     {
//       field: '',
//       headerName: 'ACTIONS',
//       width: 250,
//       renderCell: (params) => {
//         return (
//           <Grid item xs={8}>
//             <Button
//               type="button"
//               variant="light"
//               onClick={() => navigate(`/admin/user/${params._id}`)}
//             >
//               Edit
//             </Button>

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

//   const { state } = useContext(Store);
//   const { userInfo } = state;

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         dispatch({ type: 'FETCH_REQUEST' });
//         const { data } = await axios.get(`/api/users`, {
//           headers: { Authorizattion: `Bearer ${userInfo.token}` },
//         });

//         setrowData(data);
//         dispatch({ type: 'FETCH_SUCCESS', payload: data });
//       } catch (err) {
//         dispatch({
//           type: 'FETCH_FAIL',
//           payload: getError(err),
//         });
//       }
//     };
//     if (successDelete) {
//       dispatch({ type: 'DELETE_RESET' });
//     } else {
//       fetchData();
//     }
//   }, [userInfo, successDelete]);

//   const deleteHandler = async (user) => {
//     if (window.confirm('Are you sure to delete?')) {
//       try {
//         dispatch({ type: 'DELETE_REQUEST' });
//         await axios.delete(`/api/users/${user._id}`, {
//           headers: { Authorizattion: `Bearer ${userInfo.token}` },
//         });
//         toast.success('user deleted successfully');
//         dispatch({ type: 'DELETE_SUCCESS' });
//       } catch (error) {
//         toast.error(getError(error));
//         dispatch({
//           type: 'DELETE_FAIL',
//         });
//       }
//     }
//   };

//   const requestSearch = (searchValue) => {
//     const searchRegex = new RegExp(`.*${searchValue}.*`, 'ig');
//     const filteredRows = users.filter((o) => {
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
//         <Nav className="flex-column text-white w-100 p-3">
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

//       <h1>Users</h1>
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
//               pageSizeOptions={[5, 10]}
//               checkboxSelection
//             />
//           </div>
//         </>
//       )}
//     </div>
//   );
// }
