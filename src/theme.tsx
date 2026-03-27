import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Roboto, system-ui, sans-serif",
  },
  palette: {
    background: {
      default: "#ffffff", // main page background
    },
  },
});

export default theme;
