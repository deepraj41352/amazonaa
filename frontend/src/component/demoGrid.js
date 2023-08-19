// import {
//   DataGrid,
//   GridToolbarColumnsButton,
//   GridToolbarContainer,
// } from '@mui/x-data-grid';
// import SearchBar from 'material-ui-search-bar';
// import React, { useState } from 'react';

// const CustomToolbar = (props) => (
//   <div>
//     <GridToolbarContainer>
//       <GridToolbarColumnsButton />
//     </GridToolbarContainer>
//     <SearchBar {...props} />
//   </div>
// );

// export default function DemoGrid() {
//   const [searchText, setSearchText] = useState('');

//   const rows = [
//     {
//       id: 1,
//       name: 'asdf',
//       totalPrice: 9786,
//     },

//     {
//       id: 2,
//       name: 'asdf2',
//       totalPrice: 86876,
//     },
//     {
//       id: 3,
//       name: 'asdf2',
//       totalPrice: 879768,
//     },
//     {
//       id: 4,
//       name: 'asdf2',
//     },
//     {
//       id: 5,
//       name: 'asdf2',
//     },
//   ];
//   const columns = [
//     { field: 'id', headerName: 'ID', width: 110 },
//     { field: 'name', headerName: 'NAME', width: 110 },
//     { field: 'totalPrice', headerName: 'TOTAL', width: 110 },
//   ];
//   const [rowData, setrowData] = useState(rows);
//   const requestSearch = (searchValue) => {
//     console.log('searchValue', searchValue);
//     const searchRegex = new RegExp(`.*${searchValue}.*`, 'ig');
//     const filteredRows = rows.filter((o) => {
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
//     <div>
//       {' '}
//       <div style={{ height: 500, width: '100%', backgroundColor: 'white' }}>
//         <DataGrid
//           components={{ Toolbar: CustomToolbar }}
//           rows={rowData}
//           columns={columns}
//           initialState={{
//             pagination: {
//               paginationModel: { page: 0, pageSize: 2 },
//             },
//           }}
//           pageSizeOptions={[2, 4]}
//           checkboxSelection
//           componentsProps={{
//             toolbar: {
//               value: searchText,
//               onChange: (searchVal) => requestSearch(searchVal),
//               onCancelSearch: () => cancelSearch(),
//             },
//           }}
//         />
//       </div>
//     </div>
//   );
// }
