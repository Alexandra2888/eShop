// import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
// import { BASE_URL } from "../constants";


// export const apiSlice = createApi({
//   baseQuery: fetchBaseQuery({
//     baseUrl: BASE_URL, withCredentials:true,
//     prepareHeaders: (headers, { getState }) => {
//       const token = getState().auth.token;
//       if (token) {
//         headers.set('authorization', `Bearer ${token}`);
//       }
//       return headers;
//     },
//   }),
//   tagTypes: ["Product", "Order", "User", "Category"],
//   endpoints: () => ({}),
// });


import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({ baseUrl: BASE_URL });

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Product", "Order", "User", "Category"],
  endpoints: () => ({}),
});