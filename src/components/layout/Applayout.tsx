// import { Outlet, useNavigate } from "react-router";
// import authUtils from "../../utils/authUtils";
// import { useState, useEffect } from "react";
// import Loading from "../common/Loading";
// import { Box } from "@mui/material";
// import Sidebar from "../common/Sidebar";

// const Applayout = () => {
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   useEffect(
//     () => {
//       const checkAuth = async () => {
//         const user = await authUtils.isAuthenticated();
//         if (!user) {
//           navigate("/login");
//         } else {
//           setLoading(false);
//         }
//       };
//       checkAuth();
//     },
//     //   setLoading(false);
//     // }, []);
//     [navigate],
//   );
//   return loading ? (
//     <Loading fullHeight />
//   ) : (
//     <Box
//       sx={{
//         display: "flex",
//       }}
//     >
//       <Sidebar />
//       <Box
//         sx={{
//           flexGrow: 1,
//           p: 1,
//           width: "max-content",
//         }}
//       >
//         <Outlet />
//       </Box>
//     </Box>
//   );
// };

// export default Applayout;
