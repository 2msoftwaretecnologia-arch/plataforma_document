import { createTheme, Theme } from "@mui/material/styles";

// Light theme
export const lightTheme: Theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2563eb",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#64748b",
      contrastText: "#ffffff",
    },
    background: {
      default: "#ffffff",
      paper: "#f9fafb",
    },
    text: {
      primary: "#171717",
      secondary: "#6b7280",
    },
    divider: "#e5e5e5",
    error: {
      main: "#ef4444",
    },
    success: {
      main: "#10b981",
    },
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
  },
});

// Dark theme
export const darkTheme: Theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3b82f6",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#94a3b8",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0a0a0a",
      paper: "#171717",
    },
    text: {
      primary: "#ededed",
      secondary: "#a3a3a3",
    },
    divider: "#262626",
    error: {
      main: "#f87171",
    },
    success: {
      main: "#34d399",
    },
  },
  typography: {
    fontFamily: "Arial, Helvetica, sans-serif",
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#171717",
            "& fieldset": {
              borderColor: "#262626",
            },
            "&:hover fieldset": {
              borderColor: "#3b82f6",
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

export function getMuiTheme(mode: "light" | "dark"): Theme {
  return mode === "light" ? lightTheme : darkTheme;
}
