import { ThemeOptions, createTheme } from "@mui/material";

export const theme: ThemeOptions = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#FCFFFF",
      light: "#F4F4F4",
      dark: "#D9D9D9",
    },
    secondary: {
      main: "#15B6B1",
    },
  },
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  components: {
    MuiOutlinedInput: {
      defaultProps: {
        color: "secondary",
      },
    },
    MuiSelect: {
      defaultProps: {
        color: "secondary",
      },
    },
  },
});
