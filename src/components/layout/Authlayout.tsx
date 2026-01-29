// import { useState, useEffect } from "react";
// import { Outlet, useNavigate } from "react-router";
// import authUtils from "../../utils/authUtils";
// import Loading from "../common/Loading";
// // import logo from "src/assets/react.svg";
// import { Container, Box } from "@mui/material";

// const Authlayout = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   useEffect(() => {
//     const checkAuth = async () => {
//       const isAuth = await authUtils.isAuthenticated();
//       if (!isAuth) {
//         setLoading(false);
//       } else {
//         navigate("/");
//       }
//     };
//     checkAuth();
//   }, [navigate]);
//   return loading ? (
//     <Loading fullHeight />
//   ) : (
//     <Container component="main" maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           alignItems: "center",
//           flexDirection: "column",
//         }}
//       >
//         <img
//           src={"src/assets/react.svg"}
//           alt="logo"
//           style={{ width: "100px", height: "100px", marginBottom: "20px" }}
//         />
//       </Box>
//     </Container>
//   );
// };

// export default Authlayout;
