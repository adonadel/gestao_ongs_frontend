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
    MuiTextField: {
      defaultProps: {
        color: "secondary",
        variant: "outlined",
        size: "small",
        fullWidth: true,

      },
    },
    MuiSelect: {
      defaultProps: {
        size: "small",
        color: "secondary",
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
        size: "small",
      },
    },
    MuiCheckbox: {
      defaultProps: {
        color: "secondary",
        size: "small",
      },
    },
    MuiFormControlLabel: {
      defaultProps: {
        color: "secondary",        
      },
    },
    MuiInputLabel: {
      defaultProps: {
        color: "secondary",
        size: "small",
      },
    },
    MuiIconButton: {
      defaultProps: {
        color: "secondary",
        size: "small",                
      },
    },
  },
});
