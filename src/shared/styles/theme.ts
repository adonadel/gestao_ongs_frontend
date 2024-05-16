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
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
});
