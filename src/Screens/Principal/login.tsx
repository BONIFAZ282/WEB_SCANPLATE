import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from '@mui/material/Grid';
import Typography from "@mui/material/Typography";
import { createTheme, responsiveFontSizes, ThemeProvider } from "@mui/material/styles";
import Doctora from '../../FUERA.jpeg';
import Logo from "../../logo_escaner.png";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { folderDefault, URL_API } from "../../config";
import { iLUsuarios } from "../../iType";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright ©"}
      <Link
        color="inherit"
        href="https://www.utp.edu.pe/ica"
        target="__blank"
      >
        {" UTP "}
      </Link>
      {`${new Date().getFullYear()}.`}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
let defaultTheme = createTheme({
  palette: {
    primary: {
      main: '#6B68E8',
    },
    secondary: {
      main: '#6B68E8',
    },
  },
});

defaultTheme = responsiveFontSizes(defaultTheme);

export default function SignInSide() {
  const navigate = useNavigate();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    fetch(`${URL_API}/auth`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        DOCUMENTO: data.get("document"),
        CONTRASENIA: data.get("password")
      }),
    })
      .then((resp) => resp.json())
      .then((data: iLUsuarios[]) => {
        if (data.length > 0) {
          Swal.fire({
            icon: 'success',
            title: 'Credenciales correctas',
            text: `Bienvenido ${data[0].NOMBRES}`,
            confirmButtonText: 'CONTINUAR'
          }).then((response) => {
            if (response.isConfirmed) {
              localStorage.setItem('session', JSON.stringify(data[0]))
              navigate(`${folderDefault}/mantenimiento/usuarios`)
            }
          })
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Credenciales incorrectas',
            text: `Verifique sus credenciales, por favor.`,
            confirmButtonText: 'OK'
          })
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Ha ocurrido un error',
          text: err
        })
      });
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Doctora})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              sx={{ m: 1, bgcolor: "#33333310", height: 100, width: 100 }}
            >
              {
                /* eslint-disable-next-line jsx-a11y/img-redundant-alt */
                <img src={Logo} style={{ width: "60%", height: "60%" }} alt="NO IMAGE" />
              }

            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar sesión
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="document"
                label="Ingrese documento"
                name="document"
                autoComplete="off"
                autoFocus
                inputProps={{ maxLength: 8 }}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type="password"
                id="password"
                autoComplete="current-password"
                inputProps={{ maxLength: 16 }}
              />
                            <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Recuérdame"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                style={{ background: "#6B68E8" }}
                sx={{ mt: 3, mb: 2 }}
              >
                ENTRAR
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    {/* ¿Olvidaste tu contraseña? */}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
