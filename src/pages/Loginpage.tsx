// import { Box, Button, TextField } from "@mui/material";
// import LoadingButton from "@mui/lab/LoadingButton";
// import { useState } from "react";
// import { Link } from "react-router";

// const Loginpage = () => {
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = () => {};
//   return (
//     <>
//       <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="username"
//           label="Username"
//           name="username"
//           disabled={loading}
//         />
//         <TextField
//           margin="normal"
//           required
//           fullWidth
//           id="username"
//           label="Username"
//           name="username"
//           type="password"
//           disabled={loading}
//         />
//         <LoadingButton
//           sx={{ mt: 3, mb: 2 }}
//           variant="outlined"
//           fullWidth
//           color="success"
//           type="submit"
//           loading={loading}
//         >
//           Login
//         </LoadingButton>
//       </Box>
//       <Button component={Link} to="/signup" sx={{ textTransform: "none" }}>
//         Sign Up
//       </Button>
//     </>
//   );
// };

// export default Loginpage;
