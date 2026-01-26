import React from "react";
import { Box, TextField } from "@mui/material";
import Loading from "../components/common/Loading";
import LoadingButton from "@mui/lab/LoadingButton";
import { useState } from "react";
const Loginpage = () => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {};
  return (
    <>
      <Box component="form" sx={{ mt: 1 }} onSubmit={handleSubmit} noValidate>
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="username"
          label="Username"
          name="username"
          type="password"
          disabled={loading}
        />
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant="outlined"
          fullWidth
          color="success"
          type="submit"
          loading={loading}
        >
          Login
        </LoadingButton>
      </Box>
    </>
  );
};

export default Loginpage;
