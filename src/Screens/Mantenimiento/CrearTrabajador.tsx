import { useState, useEffect } from 'react';
import { Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2/Grid2';
import { DataGrid, GridActionsCellItem, GridRowClassNameParams, GridRowId, GridToolbarContainer, GridToolbarExport, esES } from '@mui/x-data-grid';
import { iLTrabajador, iResponse } from '../../iType';
import { URL_API } from '../../config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function CrearTrabajador() {

  const [formValues, setFormValues] = useState({
    ID_TRABAJADOR: "0",
    DOCUMENTO: "",
    NOMBRES: "",
    APMATERNO: "",
    APPATERNO: "",
    CARGO: ""
  });

  const [lTrabajador, setLTrabajador] = useState<iLTrabajador[]>([]);

  // ||||| EVENTOS  ||||||||
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value.trimStart(),
    }));
  };

  // ||||| RECEPCION DE DATOS |||||
  const getTrabajador = () => {
    // Crear o modificar equipo
    fetch(`${URL_API}/trabajador/list`)
      .then(resp => resp.json())
      .then((result: iLTrabajador[]) => {
        if (result.length > 0) {
          setLTrabajador(result);
        }
      })
  }



  // ||||| ENVIOS DE DATOS |||||

  // event: React.FormEvent<HTMLFormElement>
  const SaveChanged = () => {
    // Crear o modificar
    fetch(`${URL_API}/trabajador/create`, {
      method: "POST",
      headers: {
        "content-type": "application/json;charset=UTF-8",
      },
      body: JSON.stringify({
        "ID_TRABAJADOR": formValues.ID_TRABAJADOR,
        "DOCUMENTO": formValues.DOCUMENTO.trim(),
        "NOMBRES": formValues.NOMBRES.trim(),
        "APMATERNO": formValues.APMATERNO.trim(),
        "APPATERNO": formValues.APPATERNO.trim(),
        "CARGO": formValues.CARGO.trim()
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
            // Limpiar inputs
            if (result.statusCode === "201" || result.statusCode === "202") {
              setFormValues({
                ID_TRABAJADOR: "0",
                DOCUMENTO: '',
                NOMBRES: '',
                APMATERNO: '',
                APPATERNO: '',
                CARGO: ''
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
        getTrabajador();
      })
  }

  const handleEditClick = (id: GridRowId) => () => {
    let itemSelected = lTrabajador.find(item => item.ID_TRABAJADOR.toString() === id.toString());

    setFormValues({
      ...formValues,
      "ID_TRABAJADOR": itemSelected?.ID_TRABAJADOR || "0",
      "DOCUMENTO": itemSelected?.DOCUMENTO || "",
      "NOMBRES": itemSelected?.NOMBRES || "",
      "APMATERNO": itemSelected?.APMATERNO || "",
      "APPATERNO": itemSelected?.APPATERNO || "",
      "CARGO": itemSelected?.CARGO || ""
    })
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
          fetch(`${URL_API}/trabajador/delete`, {
            method: "POST",
            headers: {
              "content-type": "application/json;charset=UTF-8",
            },
            body: JSON.stringify({
              "ID_TRABAJADOR": id
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
              getTrabajador();
            })
        }
      })
  };


  const gRows = () => {
    let result: { id: number, number: number, documento: string, nombre: string, appaterno: string, apmaterno: string, cargo: string, estado: string, state: string }[] = [];
    lTrabajador && lTrabajador.forEach((item, index) => {
      result.push({
        id: parseInt(item.ID_TRABAJADOR),
        number: index + 1,
        documento: item.DOCUMENTO || "-",
        nombre: item.NOMBRES || "-",
        appaterno: item.APPATERNO || "-",
        apmaterno: item.APMATERNO || "-",
        cargo: item.CARGO || "-",
        estado: item.ESTADO === "0" ? "ELIMINADO" : "ACTIVO",
        state: item.ESTADO
      });
    })

    return result;
  }

  // ||||| MINICOMPONENTES ||||||
  // Exportar tabla
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }

  const getRowClassName = (params: GridRowClassNameParams<{ state: string }>) => {
    // Condición para aplicar estilos a una fila específica
    if (params.row.state === "0") {
      return 'remove-row'; // Clase CSS personalizada para la fila
    }
    return ''; // Sin estilos adicionales para las demás filas
  };

  useEffect(() => {
    getTrabajador()
  }, []);






  return (
    <Grid container spacing={2} justifyContent={"center"} id='crudAll'>
        <Grid xs={4} className='container-duplex'>
            <form onSubmit={(e) => { e.preventDefault(); SaveChanged(); }}>
                <FormControl fullWidth>
                    <TextField
                        required
                        name="DOCUMENTO"
                        label="DNI del Trabajador"
                        placeholder=''
                        autoComplete='off'
                        inputProps={{ maxLength: 100 }}
                        value={formValues.DOCUMENTO}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        required
                        name="NOMBRES"
                        label="Nombres Completos de Trabajador"
                        placeholder=''
                        autoComplete='off'
                        inputProps={{ maxLength: 100 }}
                        value={formValues.NOMBRES}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        required
                        name="APMATERNO"
                        label="Apellido Paterno"
                        placeholder=''
                        autoComplete='off'
                        inputProps={{ maxLength: 100 }}
                        value={formValues.APMATERNO}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        required
                        name="APPATERNO"
                        label="Apellido Materno"
                        placeholder=''
                        autoComplete='off'
                        inputProps={{ maxLength: 100 }}
                        value={formValues.APPATERNO}
                        onChange={handleChange}
                    />
                    <br />
                    <TextField
                        required
                        name="CARGO"
                        label="Cargo del Trabajador"
                        placeholder=''
                        autoComplete='off'
                        inputProps={{ maxLength: 100 }}
                        value={formValues.CARGO}
                        onChange={handleChange}
                    />
                    <br />
                    <Button
                        type="submit"
                        variant="contained"
                        style={{ backgroundColor: "#9692F5", maxWidth: 250, fontWeight: "bold", margin: "auto" }}
                    >
                        {
                            formValues.ID_TRABAJADOR !== "0" ?
                                "Actualizar" : "Registrar"
                        }
                    </Button>
                    <br />
                    {
                        formValues.ID_TRABAJADOR !== "0" &&
                        <Button
                            type="button"
                            variant="contained"
                            color="warning"
                            onClick={() => {
                                setFormValues({
                                    "ID_TRABAJADOR": "0",
                                    "DOCUMENTO": "",
                                    "NOMBRES": "",
                                    "APMATERNO": "",
                                    "APPATERNO": "",
                                    "CARGO": ""
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
                    { field: "number", headerName: "N°" },
                    { field: "documento", headerName: 'DOCUMENTO', minWidth: 150 },
                    { field: "nombre", headerName: 'NOMBRES', minWidth: 250 },
                    { field: "appaterno", headerName: 'APPATERNO', minWidth: 200 },
                    { field: "apmaterno", headerName: 'APMATERNO', minWidth: 200 },
                    { field: "cargo", headerName: 'CARGO', minWidth: 200 },
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


export default CrearTrabajador