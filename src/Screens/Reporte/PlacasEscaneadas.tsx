import React from 'react'
import { useEffect, useState, useRef } from "react";
import { iLCategoria, iLPlacaList, iLTipoVehiculo } from '../../iType';

import { Autocomplete, TextField } from '@mui/material';
import { URL_API, folderDefault } from '../../config';
import {
    DataGrid,
    GridToolbar,
    GridToolbarContainer,
    esES
} from "@mui/x-data-grid"; import { Button, ButtonProps } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import * as XLSX from 'xlsx';
import DonutSmallIcon from '@mui/icons-material/DonutSmall';
import { obtenerColoresAleatorios } from "../../Tools/CustomFunction";
import { useNavigate } from "react-router-dom";


interface iTPlacaList {
    id: number,
    number: number,
    idPersona: string,
    nombres: string,
    apPaterno: string,
    apMaterno: string,
    documento: string,
    codigo: string,
    placa: string,
    idTipoVehiculo: string,
    nomVehiculo: string,
    idCategoria: string,
    nomCategoria: string,
    fingreso: string,
    f_salida: string,
    registro: string,
}


export default function PlacasEscaneadas() {
    const navigate = useNavigate();

    const [data, setData] = useState<iLPlacaList[]>([]);
    const [filterData, setFilterData] = useState<iLPlacaList[]>([]);

    // Referencia a la API de DataGrid
    const apiRef = useRef<any>({});

    const [dataSelect, setDataSelect] = useState<{
        dVehiculo: iLTipoVehiculo[],
        dCategoria: iLCategoria[]

    }>({
        dVehiculo: [],
        dCategoria: []
    });

    const [selected, setSelected] = useState<{
        selVehiculo: iLTipoVehiculo[],
        selCategoria: iLCategoria[]
    }>({
        selVehiculo: [],
        selCategoria: []
    });



    // ||||| RECEPCION DE DATOS |||||
    const selectLoad = () => {
        // Crear o modificar equipo
        fetch(`${URL_API}/select/rplacas`, {
            method: 'POST',
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            // body: JSON.stringify({
            //   "ID_DEPARTAMENTO": formValues.idDepartamento || "0",
            // }),
        })
            .then(resp => resp.json())
            .then((result: { dVehiculo: iLTipoVehiculo[], dCategoria: iLCategoria[] }) => {
                setDataSelect((prev) => ({
                    ...prev,
                    dVehiculo: result.dVehiculo || [],
                    dCategoria: result.dCategoria || []
                }));
            })
    }

    const handleACVehiculoChange = (event: React.SyntheticEvent, value: iLTipoVehiculo[]) => {
        // console.log(event.target);
        setSelected((prev) => ({ ...prev, selVehiculo: value })); // Actualizar el estado con los nombres seleccionados
    };
    const handleACCategoriaChange = (event: React.SyntheticEvent, value: iLCategoria[]) => {
        // console.log(event.target);
        setSelected((prev) => ({ ...prev, selCategoria: value })); // Actualizar el estado con los nombres seleccionados
    };



    const getData = () => {
        fetch(`${URL_API}/reporte/placa`, {
            method: 'POST',
            headers: {
                "content-type": "application/json;charset=UTF-8",
            },
            // body: JSON.stringify({
            //   "pCargo": selectedCargo.filter(item=>item.ID_CARGO),
            // }),
        })
            .then(resp => resp.json())
            .then((result: iLPlacaList[]) => {
                if (result.length > 0) {
                    setData(result);
                }
            })
    }


    const gRows = () => {
        let result: iTPlacaList[] = [];
        let tData: iLPlacaList[] = [];
        if (selected.selVehiculo.length > 0 || selected.selCategoria.length > 0) {
            tData = filterData;
        } else {
            tData = data;
        }

        tData && tData.forEach((item, index) => {
            result.push({
                id: parseInt(item.ID_PLACA_ESCANEADA),
                number: index + 1,
                idPersona: item.ID_PERSONA || "-",
                nombres: item.NOMBRES || "-",
                apPaterno: item.APPATERNO || "-",
                apMaterno: item.APMATERNO || "-",
                documento: item.DOCUMENTO || "-",
                codigo: item.CODIGO || "-",
                placa: item.PLACA || "-",
                idTipoVehiculo: item.ID_TIPO_VEHICULO || "-",
                nomVehiculo: item.NOM_TIPO_VEHICULO || "-",
                idCategoria: item.ID_CATEGORIA || "-",
                nomCategoria: item.NOM_CATEGORIA || "-",
                fingreso: item.FECHA_INGRESO || "-",
                f_salida: item.FECHA_SALIDA || "-",
                registro: item.REGISTRO || "-"
            });
        }
        )
        return result;
    }

    const CustomToolbar = () => {
        const getActiveRows = (data: iTPlacaList[]) => {
            const columns = apiRef.current.getVisibleColumns();

            let columnsList: string[] = columns.map((item: { field: string }) => item.field);
            let headersList: string[] = columns.map((item: { headerName: string }) => item.headerName);
            console.log(apiRef.current);


            // Filtrar el array de objetos JSON y capturar solo las keys deseadas
            const filteredArray = data.map((item: any) => {
                const filteredItem: any = {};
                Object.keys(item).forEach((key) => {
                    if (columnsList.includes(key)) {
                        filteredItem[headersList[columnsList.indexOf(key)]] = item[key];
                    }
                });
                return filteredItem;
            });

            return filteredArray;
        }

        const handleExport = (data: iTPlacaList[]) => {
            const worksheet = XLSX.utils.json_to_sheet(getActiveRows(data));
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Placa');
            XLSX.writeFile(workbook, 'Reporte.xlsx');
        }


        return (
            <GridToolbarContainer>
                <GridToolbar />
                <Button
                    color="primary"
                    size="small"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => handleExport(gRows())} // Tipado distinto
                >
                    EXCEL
                </Button>
            </GridToolbarContainer>
        );
    }

    useEffect(() => {
        let filter = selected.selVehiculo.map(item => item.ID_TIPO_VEHICULO);
        let filter2 = selected.selCategoria.map(item => item.NOM_CATEGORIA);

        let tempData = data;

        if (selected.selVehiculo.length > 0) tempData = tempData.filter((item) => filter.includes(item.ID_TIPO_VEHICULO));
        if (selected.selCategoria.length > 0) tempData = tempData.filter((item) => filter2.includes(item.NOM_CATEGORIA));

        setFilterData(tempData);
    }, [selected])

    useEffect(() => {
        getData();
        selectLoad();
    }, [])


    return (
        <div id="placasxcategoria">
            <div className="tools">
                <Autocomplete
                    multiple
                    id="selvehiculo"
                    limitTags={1}
                    options={dataSelect.dVehiculo}
                    getOptionLabel={(option) => option.NOM_TIPO_VEHICULO}
                    filterSelectedOptions
                    disableCloseOnSelect
                    value={selected.selVehiculo}
                    onChange={handleACVehiculoChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Vehiculo"
                            placeholder="Vehiculo"
                        />
                    )}
                />
                <Autocomplete
                    multiple
                    id="selCategoria"
                    limitTags={1}
                    options={dataSelect.dCategoria}
                    getOptionLabel={(option) => option.NOM_CATEGORIA.toString()}
                    disableCloseOnSelect
                    filterSelectedOptions
                    value={selected.selCategoria}
                    onChange={handleACCategoriaChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Categoria"
                            placeholder="Categoria"
                        />
                    )}
                />
            </div>
            <div className="table">
                <DataGrid
                    apiRef={apiRef}
                    editMode="row"
                    columns={[
                        { field: "number", headerName: "N°" },
                        { field: "nombres", headerName: "NOMBRES", minWidth: 180 },
                        { field: "apPaterno", headerName: "APPATERNO", minWidth: 180 },
                        { field: "apMaterno", headerName: "APMATERNO", minWidth: 180 },
                        { field: "documento", headerName: "DOCUMENTO", minWidth: 130 },
                        { field: "codigo", headerName: "CODIGO", minWidth: 130 },
                        { field: "placa", headerName: "PLACA", minWidth: 130 },
                        { field: "nomVehiculo", headerName: "VEHICULO", minWidth: 130 },
                        { field: "nomCategoria", headerName: "CATEGORIA", minWidth: 130 },
                        { field: "fingreso", headerName: "F_INGRESO", minWidth: 200 },
                        { field: "f_salida", headerName: "F_SALIDA", minWidth: 200 },
                        { field: "registro", headerName: "REGISTRO", minWidth: 50 },
                    ]}
                    rows={gRows()}
                    slots={{
                        toolbar: CustomToolbar,
                    }}
                    localeText={esES.components.MuiDataGrid.defaultProps.localeText}
                />
            </div>
        </div>
    );
}