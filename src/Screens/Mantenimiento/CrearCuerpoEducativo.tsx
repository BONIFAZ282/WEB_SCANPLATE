import { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DataGrid, GridActionsCellItem, GridRowClassNameParams, GridRowId, GridToolbarContainer, GridToolbarExport, esES } from '@mui/x-data-grid';
import { iLCuerpoEducativo, iLPrivilegio, iResponse, iLCategoria, iLTipoVehiculo } from '../../iType';
import { URL_API } from '../../config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function CrearCuerpoEducativo() {
  const [formValues, setFormValues] = useState({
    ID_CUERPO_EDUCATIVO: "0",
    NOMBRES: "",
    APPATERNO: "",
    APMATERNO: "",
    DOCUMENTO: "",
    CODIGO: "",
    ID_CATEGORIA: "",
    ID_TIPO_VEHICULO: "",
    PLACA: "",
    CONTRASENIA: ""
  });

  const [lCuerpoEducativo, setLCuerpoEducativo] = useState<iLCuerpoEducativo[]>([]);
  const [categoriaSelect, setCategoriaSelect] = useState<{ dCategoria: iLCategoria[] }>({ dCategoria: [] });
  const [tipoVehiculoSelect, setTipoVehiculoSelect] = useState<{ dTipoVehiculo: iLTipoVehiculo[] }>({ dTipoVehiculo: [] });
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

  const selectCategoria = () => {
    fetch(`${URL_API}/select/categoria`)
      .then(resp => resp.json())
      .then((result: iLCategoria[]) => {
        setCategoriaSelect({
          "dCategoria": result
        });
      })
  }

  const selectTipoVehiculo = () => {
    fetch(`${URL_API}/select/vehiculo`)
      .then(resp => resp.json())
      .then((result: iLTipoVehiculo[]) => {
        setTipoVehiculoSelect({
          "dTipoVehiculo": result
        });
      })
  }

  const getCuerpoEducativo = () => {
    fetch(`${URL_API}/cuerpo_educativo/list`)
      .then(resp => resp.json())
      .then((result: iLCuerpoEducativo[]) => {
        if (result.length > 0) {
          setLCuerpoEducativo(result);
        }
      })
  }

  const saveChanged = () => {
    if (validate()) {
      const url = formValues.ID_CUERPO_EDUCATIVO === "0" ? `${URL_API}/cuerpo_educativo/crear` : `${URL_API}/cuerpo_educativo/actualizar`;

      fetch(url, {
        method: "POST",
        headers: {
          "content-type": "application/json;charset=UTF-8",
        },
        body: JSON.stringify({
          "ID_CUERPO_EDUCATIVO": formValues.ID_CUERPO_EDUCATIVO,
          "NOMBRES": formValues.NOMBRES,
          "APPATERNO": formValues.APPATERNO,
          "APMATERNO": formValues.APMATERNO,
          "DOCUMENTO": formValues.DOCUMENTO,
          "CODIGO": formValues.CODIGO,
          "ID_CATEGORIA": formValues.ID_CATEGORIA,
          "ID_TIPO_VEHICULO": formValues.ID_TIPO_VEHICULO,
          "PLACA": formValues.PLACA,
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
                  ID_CUERPO_EDUCATIVO: "0",
                  NOMBRES: '',
                  APPATERNO: '',
                  APMATERNO: '',
                  DOCUMENTO: '',
                  CODIGO: '',
                  ID_CATEGORIA: categoriaSelect.dCategoria.length > 0 ? categoriaSelect.dCategoria[0].ID_CATEGORIA : "",
                  ID_TIPO_VEHICULO: tipoVehiculoSelect.dTipoVehiculo.length > 0 ? tipoVehiculoSelect.dTipoVehiculo[0].ID_TIPO_VEHICULO : "",
                  PLACA: "",
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
          getCuerpoEducativo();
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
    let itemSelected = lCuerpoEducativo.find(item => item.ID_CUERPO_EDUCATIVO.toString() === id.toString());

    setFormValues({
      ...formValues,
      "ID_CUERPO_EDUCATIVO": itemSelected?.ID_CUERPO_EDUCATIVO || "0",
      "NOMBRES": itemSelected?.NOMBRES || "",
      "APPATERNO": itemSelected?.APPATERNO || "",
      "APMATERNO": itemSelected?.APMATERNO || "",
      "DOCUMENTO": itemSelected?.DOCUMENTO || "",
      "CODIGO": itemSelected?.CODIGO || "",
      "ID_CATEGORIA": itemSelected?.ID_CATEGORIA || "",
      "ID_TIPO_VEHICULO": itemSelected?.ID_TIPO_VEHICULO || "",
      "PLACA": itemSelected?.PLACA || "",
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
          fetch(`${URL_API}/cuerpo_educativo/eliminar`, {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              "ID_CUERPO_EDUCATIVO": id
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
              getCuerpoEducativo();
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
      nomCategoria: string,
      nomTipoVehiculo: string,
      placa: string,
      estado: string,
      state: string
    }[] = [];
    lCuerpoEducativo && lCuerpoEducativo.forEach((item, index) => {
      result.push({
        id: parseInt(item.ID_CUERPO_EDUCATIVO),
        number: index + 1,
        nombres: item.NOMBRES || "-",
        apPaterno: item.APPATERNO,
        apMaterno: item.APMATERNO,
        documento: item.DOCUMENTO,
        codigo: item.CODIGO,
        nomCategoria: item.NOM_CATEGORIA,
        nomTipoVehiculo: item.NOM_TIPO_VEHICULO,
        placa: item.PLACA,
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
    selectCategoria();
    selectTipoVehiculo();
    getCuerpoEducativo();
  }, []);

  return (
    <Grid container spacing={2} justifyContent={"center"} id='crudAll'>
      <Grid xs={4} className='container-duplex'>
        <form onSubmit={(e) => { e.preventDefault(); saveChanged(); }}>
          <FormControl fullWidth>
            <InputLabel id="selCategoria">Categoría</InputLabel>
            <Select
              labelId="selCategoria"
              name='ID_CATEGORIA'
              value={formValues.ID_CATEGORIA}
              label="Categoría"
              onChange={handleChangeSelect}
            >
              {
                categoriaSelect?.dCategoria &&
                categoriaSelect?.dCategoria.map((item, index) => (
                  <MenuItem key={index} value={item.ID_CATEGORIA}>{item.NOM_CATEGORIA}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
          <br />
          <br />
          <FormControl fullWidth>
            <InputLabel id="selTipoVehiculo">Tipo de Vehículo</InputLabel>
            <Select
              labelId="selTipoVehiculo"
              name='ID_TIPO_VEHICULO'
              value={formValues.ID_TIPO_VEHICULO}
              label="Tipo de Vehículo"
              onChange={handleChangeSelect}
            >
              {
                tipoVehiculoSelect?.dTipoVehiculo &&
                tipoVehiculoSelect?.dTipoVehiculo.map((item, index) => (
                  <MenuItem key={index} value={item.ID_TIPO_VEHICULO}>{item.NOM_TIPO_VEHICULO}</MenuItem>
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
              disabled={formValues.ID_CUERPO_EDUCATIVO !== "0"} // Disable when updating
            />
            <br />

            <TextField
              required
              name="CODIGO"
              label="Código"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 9 }}
              value={formValues.CODIGO}
              onChange={handleChange}
              error={Boolean(errors.CODIGO)}
              helperText={errors.CODIGO}
              disabled={formValues.ID_CUERPO_EDUCATIVO !== "0"} // Disable when updating
            />
            <br />

            <TextField
              required
              name="PLACA"
              label="Placa"
              placeholder=''
              autoComplete='off'
              inputProps={{ maxLength: 7 }}
              value={formValues.PLACA}
              onChange={handleChange}
            />
            <br />

            <TextField
              required
              name="CONTRASENIA"
              label="Contraseña"
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
                formValues.ID_CUERPO_EDUCATIVO !== "0" ?
                  "Actualizar" : "Registrar"
              }
            </Button>
            <br />
            {
              formValues.ID_CUERPO_EDUCATIVO !== "0" &&
              <Button
                type="button"
                variant="contained"
                color="warning"
                onClick={() => {
                  setFormValues({
                    ID_CUERPO_EDUCATIVO: "0",
                    NOMBRES: '',
                    APPATERNO: '',
                    APMATERNO: '',
                    DOCUMENTO: '',
                    CODIGO: '',
                    ID_CATEGORIA: '',
                    ID_TIPO_VEHICULO: '',
                    PLACA: '',
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
            { field: "codigo", headerName: 'CÓDIGO', minWidth: 100 },
            { field: "nombres", headerName: 'NOMBRES', minWidth: 200 },
            { field: "apPaterno", headerName: 'AP. PATERNO', minWidth: 150 },
            { field: "apMaterno", headerName: 'AP. MATERNO', minWidth: 150 },
            { field: "nomCategoria", headerName: 'CATEGORÍA', minWidth: 150 },
            { field: "nomTipoVehiculo", headerName: 'TIPO VEHÍCULO', minWidth: 150 },
            { field: "placa", headerName: 'PLACA', minWidth: 100 },
            { field: "estado", headerName: 'ESTADO', minWidth: 100 },
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

export default CrearCuerpoEducativo;
