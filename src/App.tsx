import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseLine from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Route, Routes } from "react-router"; //react-router-dom is not needed as of v6
import Applayout from "./components/layout/Applayout";
import Authlayout from "./components/layout/Authlayout";
import Homepage from "./pages/Homepage";
import Boardpage from "./pages/Boardpage";
import Loginpage from "./pages/Loginpage";
import Signuppage from "./pages/Signuppage";

function App() {
  const theme = createTheme({
    palette: { mode: "light" },
  });
  return (
    <ThemeProvider theme={theme}>
      <CssBaseLine />
      <BrowserRouter>
        <Routes>
          // Authlayout routes
          <Route path="/" element={<Authlayout />}>
            <Route path="login" element={<Loginpage />} />
            <Route path="signup" element={<Signuppage />} />
          </Route>
          // Applayout routes
          <Route path="/" element={<Applayout />}>
            <Route index element={<Homepage />} />
            <Route path="boards" element={<Homepage />} />
            <Route path="boards/:boardId" element={<Boardpage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
