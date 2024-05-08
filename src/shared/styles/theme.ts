import { ThemeOptions, createTheme } from "@mui/material";

export const theme: ThemeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FCFFFF",
    },
    secondary: {
      main: "#15B6B1",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
      @font-face {
        font-family: 'Inter';
        font-style: normal;
        font-weight: 400;
        src: url('https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap');
      }`,
    },
  },
});
