// import axios, { Axios } from "axios";
// //endpoint. debug with this
// const baseUrl = "http://localhost:5000/api/v1";
// const getToken = () => localStorage.getItem("token");
// //qs alternative
// const AxiosClient = axios.create({
//   baseURL: baseUrl,
//   paramsSerializer: (params) => {
//     const searchParams = new URLSearchParams();
//     Object.keys(params).forEach((key) => {
//       searchParams.append(key, params[key]);
//     });
//     return searchParams.toString();
//   },
// });
// //claude source
// AxiosClient.interceptors.request.use(async (config) => {
//   config.headers["Content-Type"] = "application/json";
//   config.headers["Authorization"] = `Bearer ${getToken()}`;
//   return config;
// });
// //youtube source
// // AxiosClient.interceptors.request.use(async config => {
// //     return {
// //         ...config,
// //         headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer ${getToken()}`
// //         }
// //     }
// // })

// AxiosClient.interceptors.response.use(
//   (Response) => {
//     if (Response && Response.data) return Response.data;
//     return Response;
//   },
//   (err) => {
//     if (!err.response) {
//       return alert(err);
//     }
//     throw err.response;
//   },
// );

// export default AxiosClient;
