import { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DataGrid, GridActionsCellItem, GridRowClassNameParams, GridRowId, GridToolbarContainer, GridToolbarExport, esES } from '@mui/x-data-grid';
import { iLUsuarios, iLPrivilegio, iResponse } from '../../iType';
import dayjs from "dayjs";
import { URL_API } from '../../config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function CrearUsuario() {
  const [formValues, setFormValues] = useState({
    ID_USUARIO: "0",
    NOMBRES: "",
    APPATERNO: "",
    APMATERNO: "",
    DOCUMENTO: "",
    CODIGO: "",
    ID_PRIVILEGIO: "",
    CONTRASENIA: ""
  });

  const [lUsuarios, setLUsuarios] = useState<iLUsuarios[]>([]);
  const [privilegioSelect, setPrivilegioSelect] = useState<{ dPrivilegio: iLPrivilegio[] }>({ dPrivilegio: [] });
  const [errors, setErrors] = useState({
    DOCUMENTO: "",
    CODIGO: ""
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value.trimStart(),
    }));
  };

  const handleChangeSelect = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const validate = () => {
    let isValid = true;
    let errors = { DOCUMENTO: "", CODIGO: "" };

    if (!/^\d{8}$/.test(formValues.DOCUMENTO)) {
      errors.DOCUMENTO = "El documento debe tener exactamente 8 dígitos.";
      isValid = false;
    }

    if (!/^(U\d{8}|C\d{5})$/.test(formValues.CODIGO)) {
      errors.CODIGO = "El código debe ser U seguido de 8 dígitos o C seguido de 5 dígitos.";
      isValid = false;
    }

    setErrors(errors);
    return isValid;
  };

  const selectPrivilegio = () => {
    fetch(`${URL_API}/select/privilegio`)
      .then(resp => resp.json())
      .then((result: iLPrivilegio[]) => {
        setPrivilegioSelect({
          "dPrivilegio": result
        });
      })
  }

  const getUsuario = () => {
    fetch(`${URL_API}/usuario/list`)
      .then(resp => resp.json())
      .then((result: iLUsuarios[]) => {
        if (result.length > 0) {
          setLUsuarios(result);
        }
      })
  }

  const saveChanged = () => {
    if (validate()) {
      const url = formValues.ID_USUARIO === "0" ? `${URL_API}/usuario/crear` : `${URL_API}/usuario/actualizar`;

      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          "ID_USUARIO": formValues.ID_USUARIO,
          "NOMBRES": formValues.NOMBRES,
          "APPATERNO": formValues.APPATERNO,
          "APMATERNO": formValues.APMATERNO,
          "DOCUMENTO": formValues.DOCUMENTO,
          "CODIGO": formValues.CODIGO,
          "ID_PRIVILEGIO": formValues.ID_PRIVILEGIO,
          "CONTRASENIA": formValues.CONTRASENIA
        }),
      })
        .then(resp => resp.json())
        .then((result: iResponse) => {
          Swal.fire({
            icon: result.icon as SweetAlertIcon,
            title: result.title,
            text: result.text
          }).then((resp) => {
            if (resp.isConfirmed) {
              if (result.statusCode === "201" || result.statusCode === "202") {
                setFormValues({
                  ID_USUARIO: "0",
                  NOMBRES: '',
                  APPATERNO: '',
                  APMATERNO: '',
                  DOCUMENTO: '',
                  CODIGO: '',
                  ID_PRIVILEGIO: privilegioSelect.dPrivilegio.length > 0 ? privilegioSelect.dPrivilegio[0].ID_PRIVILEGIO : "",
                  CONTRASENIA: ""
                });
              }
            }
          })
        })
        .catch((err) =>
          Swal.fire({
            icon: 'error',
            title: 'ERROR',
            text: err
          })
        )
        .finally(() => {
          getUsuario();
        });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'VALIDACIÓN',
        text: 'Por favor, corrija los errores en el formulario.'
      });
    }
  }

  const handleEditClick = (id: GridRowId) => () => {
    let itemSelected = lUsuarios.find(item => item.ID_USUARIO.toString() === id.toString());

    setFormValues({
      ...formValues,
      "ID_USUARIO": itemSelected?.ID_USUARIO || "0",
      "NOMBRES": itemSelected?.NOMBRES || "",
      "APPATERNO": itemSelected?.APPATERNO || "",
      "APMATERNO": itemSelected?.APMATERNO || "",
      "DOCUMENTO": itemSelected?.DOCUMENTO || "",
      "CODIGO": itemSelected?.CODIGO || "",
      "ID_PRIVILEGIO": itemSelected?.ID_PRIVILEGIO || "0",
      "CONTRASENIA": itemSelected?.CONTRASENIA || ""
    });
  }

  const handleDeleteClick = (id: GridRowId) => () => {
    Swal.fire({
      icon: 'question',
      title: 'MENSAJE DEL SISTEMA',
      text: '¿Seguro que desea eliminar el siguiente elemento?',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      showDenyButton: true
    })
      .then((resp) => {
        if (resp.isConfirmed) {
          fetch(`${URL_API}/usuario/delete`, {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              "ID_USUARIO": id
            }),
          })
            .then(resp => resp.json())
            .then((result: iResponse) => {
              Swal.fire({
                icon: result.icon as SweetAlertIcon,
                title: result.title,
                text: result.text
              });
            }).finally(() => {
              getUsuario();
            })
        }
      })
  };

  const gRows = () => {
    let result: {
      id: number,
      number: number,
      nombres: string,
      apPaterno: string,
      apMaterno: string,
      documento: string,
      codigo: string,
      nomPrivilegio: string,
      estado: string,
      state: string
    }[] = [];
    lUsuarios && lUsuarios.forEach((item, index) => {
      result.push({
        id: parseInt(item.ID_USUARIO),
        number: index + 1,
        nombres: item.NOMBRES || "-",
        apPaterno: item.APPATERNO,
        apMaterno: item.APMATERNO,
        documento: item.DOCUMENTO,
        codigo: item.CODIGO,
        nomPrivilegio: item.NOMBRE_PRIVILEGIO,
        estado: item.ESTADO === "0" ? "ELIMINADO" : "ACTIVO",
        state: item.ESTADO
      });
    });
    return result;
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const getRowClassName = (params: GridRowClassNameParams<{ state: string }>) => {
    if (params.row.state === "0") {
      return 'remove-row';
    }
    return '';
  };

  useEffect(() => {
    selectPrivilegio();
    getUsuario();
  }, []);

  return (
    <Grid container spacing={2} justifyContent={"center"} id='crudAll'>
      <Grid xs={4} className='container-duplex'>
        <form onSubmit={(e) => { e.preventDefault(); saveChanged(); }}>

          <FormControl fullWidth>
            <InputLabel id="selPrivilegio">Privilegio</InputLabel>
            <Select
              labelId="selPrivilegio"
              name='ID_PRIVILEGIO'
              value={formValues.ID_PRIVILEGIO}
              label="Privilegio"
              onChange={handleChangeSelect}
            >
              {
                privilegioSelect?.dPrivilegio &&
                privilegioSelect?.dPrivilegio.map((item, index) => (
                  <MenuItem key={index} value={item.ID_PRIVILEGIO}>{item.NOM_PRIVILEGIO}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <TextField
              required
              name="NOMBRES"
              label="Nombres"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 100 }}
              value={formValues.NOMBRES}
              onChange={handleChange}
            />
            <br />

            <TextField
              required
              name="APPATERNO"
              label="Apellido Paterno"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 100 }}
              value={formValues.APPATERNO}
              onChange={handleChange}
            />
            <br />

            <TextField
              required
              name="APMATERNO"
              label="Apellido Materno"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 100 }}
              value={formValues.APMATERNO}
              onChange={handleChange}
            />
            <br />

            <TextField
              required
              name="DOCUMENTO"
              label="Documento"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 8 }}
              value={formValues.DOCUMENTO}
              onChange={handleChange}
              error={Boolean(errors.DOCUMENTO)}
              helperText={errors.DOCUMENTO}
              disabled={formValues.ID_USUARIO !== "0"} // Disable when updating
            />
            <br />

            <TextField
              required
              name="CODIGO"
              label="Codigo"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 9 }}
              value={formValues.CODIGO}
              onChange={handleChange}
              error={Boolean(errors.CODIGO)}
              helperText={errors.CODIGO}
              disabled={formValues.ID_USUARIO !== "0"} // Disable when updating
            />
            <br />
            <TextField
              required
              name="CONTRASENIA"
              label="CONTRASENIA"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 100 }}
              value={formValues.CONTRASENIA}
              onChange={handleChange}
            />
            <br />
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <Button
              type="submit"
              variant="contained"
              style={{ backgroundColor: "#9692F5", maxWidth: 250, fontWeight: "bold", margin: "auto" }}
            >
              {
                formValues.ID_USUARIO !== "0" ?
                  "Actualizar" : "Registrar"
              }
            </Button>
            <br />
            {
              formValues.ID_USUARIO !== "0" &&
              <Button
                type="button"
                variant="contained"
                color="warning"
                onClick={() => {
                  setFormValues({
                    ID_USUARIO: "0",
                    NOMBRES: '',
                    APPATERNO: '',
                    APMATERNO: '',
                    DOCUMENTO: '',
                    CODIGO: '',
                    ID_PRIVILEGIO: '',
                    CONTRASENIA: ''
                  });
                }}
                style={{ maxWidth: 250, fontWeight: "bold", margin: "auto" }}
              >
                Cancelar
              </Button>
            }
          </FormControl>
        </form>
      </Grid>
      <Grid xs={8}>
        <DataGrid
          editMode="row"
          columns={[
            { field: "number", headerName: "N°", minWidth: 50 },
            { field: "documento", headerName: 'DNI', minWidth: 100 },
            { field: "codigo", headerName: 'CODIGO', minWidth: 100 },
            { field: "nombres", headerName: 'NOMBRES', minWidth: 200 },
            { field: "apPaterno", headerName: 'AP. PATERNO', minWidth: 150 },
            { field: "apMaterno", headerName: 'AP. MATERNO', minWidth: 150 },
            { field: "nomPrivilegio", headerName: 'PRIVILEGIO', minWidth: 200 },
            { field: "estado", headerName: 'ESTADO', minWidth: 150 },
            {
              field: 'actions',
              type: 'actions',
              headerName: 'Acciones',
              width: 100,
              cellClassName: 'actions',
              getActions: ({ id, row }) => {
                return [
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                    disabled={row.state === "0"}
                  />,
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    className='deleteAction'
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                    disabled={row.state === "0"}
                  />,
                ];
              },
            },
          ]}
          getRowClassName={getRowClassName}
          rows={gRows()}
          slots={{
            toolbar: CustomToolbar,
          }}
          localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        />
      </Grid>
    </Grid>
  )
}

export default CrearUsuario;
