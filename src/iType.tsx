interface iResponse {
  icon: string;
  statusCode: string;
  title: string;
  text: string;
  data: any[];
}


interface iLUsuarios {
  ID_USUARIO: string;
  ID_PERSONA: string;
  ID_PRIVILEGIO: string;
  ID_SEGURIDAD: string;
  NOMBRE_PRIVILEGIO: string;
  CONTRASENIA: string;
  NOMBRES: string;
  APPATERNO: string;
  APMATERNO: string;
  DOCUMENTO: string;
  CODIGO: string;
  ESTADO: string;
}

interface iLPersona {
  ID_PERSONA: string;
  NOMBRES: string;
  APPATERNO: string;
  APMATERNO: string;
  DOCUMENTO: string;
  CARGO: string;
  ESTADO: string;
}

interface iLCliente {
  ID_CLIENTE: string;
  DOCUMENTO: string;
  NOMBRES: string;
  APMATERNO: string;
  APPATERNO: string;
  CELULAR: string;
  ESTADO: string;
}


interface iLTrabajador {
  ID_TRABAJADOR: string;
  NOMBRES: string;
  APPATERNO: string;
  APMATERNO: string;
  DOCUMENTO: string;
  CARGO: string;
  ESTADO: string;
}

interface iLPrivilegio {
  ID_PRIVILEGIO: string;
  NOM_PRIVILEGIO: string;
  ESTADO: string;
}

interface iLCategoria {
  ID_CATEGORIA: string;
  NOM_CATEGORIA: string;
  ESTADO: string;
}


interface iLTipoVehiculo {
  ID_TIPO_VEHICULO: string;
  NOM_TIPO_VEHICULO: string;
  ESTADO: string;
}

interface iLPlacaList {
  ID_PLACA_ESCANEADA: string;
  ID_PERSONA: string;
  NOMBRES: string;
  APPATERNO: string;
  APMATERNO: string;
  DOCUMENTO: string;
  CODIGO: string;
  PLACA: string;
  ID_TIPO_VEHICULO: string;
  NOM_TIPO_VEHICULO: string;
  ID_CATEGORIA: string;
  NOM_CATEGORIA: string;
  FECHA_INGRESO: string;
  FECHA_SALIDA: string;
  REGISTRO: string;
}

interface iDailyData {
  dia: string;
  cantidad_vehiculos: number;
}

interface iMonthlyData {
  anio: number;
  mes: number;
  cantidad_vehiculos: number;
}

interface iYearlyData {
  anio: number;
  cantidad_vehiculos: number;
}

interface iVehicleTypeData {
  NOM_TIPO_VEHICULO: string;
  cantidad: number;
}

interface iCategoryData {
  NOM_CATEGORIA: string;
  cantidad: number;
}


interface iLAnio {
  ANIO: string;
}

export type {
  iLCliente,
  iLCategoria,
  iLTipoVehiculo,
  iLUsuarios,
  iLTrabajador,
  iLPersona,
  iResponse,
  iLPrivilegio,
  iLAnio,
  iLPlacaList,
  iDailyData,
  iMonthlyData,
  iYearlyData,
  iVehicleTypeData,
  iCategoryData
};
