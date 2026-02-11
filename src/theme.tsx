import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: {
    borderRadius: 8,
  },
  typography: {
    fontFamily: "Roboto, system-ui, sans-serif",
  },
});

export default theme;

// export const getTheme = (mode: "light" | "dark") =>
//   createTheme({
//     palette: {
//       mode,
//       ...(mode === "dark" ? {
//         background: {
//           default: "#121212",
//           paper: "#1e1e1e",
//         },
//       }: {})
//     },
//   });
