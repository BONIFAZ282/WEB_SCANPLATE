import { useState, useEffect } from 'react';
import { DataGrid, GridActionsCellItem, GridRowClassNameParams, GridRowId, GridToolbarContainer, GridToolbarExport, esES } from '@mui/x-data-grid';
import { iLUsuarios, iResponse } from '../../iType';
import { URL_API } from '../../config';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

function UsuariosEliminados() {
  const [lUsuarios, setLUsuarios] = useState<iLUsuarios[]>([]);

  const getUsuariosEliminados = () => {
    fetch(`${URL_API}/usuario/list/eliminado`)
      .then(resp => resp.json())
      .then((result: iLUsuarios[]) => {
        // Filtrar solo los usuarios con estado '0'
        const usuariosEliminados = result.filter(usuario => usuario.ESTADO === '0');
        setLUsuarios(usuariosEliminados);
      });
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    Swal.fire({
      icon: 'question',
      title: 'MENSAJE DEL SISTEMA',
      text: '¿Seguro que desea eliminar definitivamente este usuario?',
      confirmButtonText: 'Sí',
      showCancelButton: true,
      showDenyButton: true
    })
      .then((resp) => {
        if (resp.isConfirmed) {
          fetch(`${URL_API}/usuario/eliminar_definitivo`, {
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
              getUsuariosEliminados();
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
    getUsuariosEliminados();
  }, []);

  return (
    <div style={{ height: 600, width: '100%' }}>
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
                  icon={<DeleteIcon />}
                  label="Delete"
                  className='deleteAction'
                  onClick={handleDeleteClick(id)}
                  color="inherit"
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
    </div>
  )
}

export default UsuariosEliminados;
