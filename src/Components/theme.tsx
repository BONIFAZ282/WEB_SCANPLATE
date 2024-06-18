import { PaletteMode, PaletteOptions } from "@mui/material";
import { createTheme } from "@mui/material/styles";

// Augment the palette to include a salmon color
declare module '@mui/material/styles' {
    interface Palette {
        salmon: Palette['primary'];
        prueba: Palette['primary'];
        hover: Palette['primary'];
    }

    interface PaletteOptions {
        salmon?: PaletteOptions['primary'];
        prueba?: PaletteOptions['primary'];
        hover?: PaletteOptions['primary'];
    }
}

// Update the Button's color options to include a salmon option
declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        salmon: true;
        prueba: true;
        hover: true;
    }
}



const theme = (mode: PaletteMode) => createTheme({
    components: {
        MuiTextField: {
            defaultProps: {
                size: "small"
            }
        },
        MuiSelect: {
            defaultProps: {
                size: "small"
            }
        },
        MuiInput: {
            defaultProps: {
                size: "small"
            }
        },
        MuiInputLabel: {
            defaultProps: {
                size: "small"
            }
        },
        MuiButton: {
            defaultProps: {
                size: 'small'
            },
        }
    },
    palette: colors(mode)
});

const colors = (mode: PaletteMode): PaletteOptions =>
    mode === "light" ?
        ({
            mode: "light",
            primary: {
                main: "#e41e1f",
                dark: "#000",
            },
            secondary: {
                main: "#c8c8c8",
                contrastText: "#333"
            },
            warning: {
                main: "#fcbf49",
            },
            success: {
                main: "#66bb6a",
                contrastText: '#fff'
            },
            error: {
                main: "#f44336",
            },
            info: {
                main: "#88c7d8",
                contrastText: "#fff"
            },
            hover: {
                main: "#000"
            }
        }) :
        ({
            mode: "dark",
            primary: {
                main: "#83142C",
                dark: "#AD1D45"
            },
            secondary: {
                main: "#AD1D45",
                dark: "#AD1D45",
                contrastText: "#333"
            },
            warning: {
                main: "#fcbf49",
            },
            success: {
                main: "#66bb6a",
                contrastText: '#fff'
            },
            error: {
                main: "#f44336",
            },
            info: {
                main: "#88c7d8",
                contrastText: "#fff"
            },
            hover: {
                main: "#AD1D45"
            }
        })

export { theme };