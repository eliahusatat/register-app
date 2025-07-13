import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import "./index.css";
import "@mantine/core/styles.css";

const theme = createTheme({
  primaryColor: "primary",
  colors: {
    // #6C4D9A
    primary: [
      "#f6f0ff",
      "#e6dff1",
      "#cabdde",
      "#ac98ca",
      "#9379ba",
      "#8466b0",
      "#7c5bac",
      "#6a4c97",
      "#5e4388",
      "#523879",
    ],
    // #4E56A2
    secondary: [
      "#f0f1ff",
      "#dee0f2",
      "#bcbfdf",
      "#979ccc",
      "#787ebb",
      "#646bb2",
      "#5a61ae",
      "#4a5199",
      "#40488a",
      "#353e7b",
    ],
  },
  primaryShade: { light: 6, dark: 8 },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MantineProvider theme={theme} >
        <Notifications position="bottom-right"/>
        <App />
      </MantineProvider>
    </BrowserRouter>
  </React.StrictMode>
);
