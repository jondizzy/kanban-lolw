import React from "react";
import ReactDOM from "react-dom/client";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { Provider } from "react-redux";
import { store } from "./store/store";
import KanbanPage from "./features/kanban/pages/KanbanPage";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Provider store={store}>
        <KanbanPage />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
);
