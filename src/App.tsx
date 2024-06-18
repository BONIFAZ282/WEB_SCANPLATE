// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { folderDefault } from "./config";
import NoFound from "./Components/NoFound";
import PrivateRoute from "./Components/PrivateRoute";
import DrawerContent from "./Components/DrawerContent";
import Login from './Screens/Principal/login';
import "./App.sass"


import CrearUsuario from "./Screens/Mantenimiento/CrearUsuario";
import CrearPrivilegio from "./Screens/Mantenimiento/CrearPrivilegio";
import CrearCategoria from "./Screens/Mantenimiento/CrearCategoria";
import CrearTipoVehiculo from "./Screens/Mantenimiento/CrearTipoVehiculo";
import UsuariosEliminados from "./Screens/Mantenimiento/UsuariosEliminados";

import PlacasEscaneadas from "./Screens/Reporte/PlacasEscaneadas";

import VehicleEntriesChart from "./Screens/Graficos/VehicleEntriesChart";
import PieCharts from "./Screens/Graficos/PieCharts";

function App() {
  return (
    <div id="App">
      <Routes>
        <Route
          path={`${folderDefault}/`}
          errorElement={<Navigate to={`${folderDefault}/login`} />}
        >
          <Route path={`${folderDefault}/`} element={<Navigate to={`${folderDefault}/login`} />}></Route>

          {/* Login */}
          <Route path={`${folderDefault}/login`} element={<Login />}></Route>

          {/* Mantenimiento */}
          <Route
            path={`${folderDefault}/mantenimiento/usuarios`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<CrearUsuario />} title="Usuario" />} />}
          ></Route>
                    <Route
            path={`${folderDefault}/mantenimiento/usuarios/eliminados`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<UsuariosEliminados />} title="Usuarios Eliminados" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/mantenimiento/privilegios`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<CrearPrivilegio />} title="Privilegio" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/mantenimiento/categorias`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<CrearCategoria />} title="Categoria" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/mantenimiento/tipoVehiculo`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<CrearTipoVehiculo />} title="Privilegio" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/reporte/placasEscaneadas`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<PlacasEscaneadas />} title="Placas Escaneadas" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/grafico/cantidad`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<VehicleEntriesChart />} title="Prueba" />} />}
          ></Route>
          <Route
            path={`${folderDefault}/grafico/pie`}
            element={<PrivateRoute onlyAdmin={true} element={<DrawerContent element={<PieCharts />} title="Grafico Pie" />} />}
          ></Route>


          <Route path={`${folderDefault}/*`} element={<NoFound />}></Route>
        </Route>
      </Routes>
    </div>
  );
}
export default App;