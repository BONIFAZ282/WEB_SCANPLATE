import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faToolbox,
  IconDefinition,
  faUser,
  faUserCog,
  faUserShield,
  faChartSimple,
  faDisplay,
  faPeopleGroup,
  faUserNurse, faMoneyCheckAlt, faClipboardList,
  faUserSlash,
} from "@fortawesome/free-solid-svg-icons";
import { Collapse, Divider, List, ListItemButton, ListItemIcon, ListItemText, Tooltip } from "@mui/material";
import { NavLink } from "react-router-dom";
import { folderDefault } from "../config";
import { allowPermission } from "../Tools/Auth";
import { useState } from "react";
import dayjs from 'dayjs';
import 'dayjs/locale/es';


const ItemCategory:
  React.FC<{ title: string, setItem: () => any, icon: IconDefinition, open: boolean }> =
  ({ title, setItem, icon, open }) => {
    return (
      <Tooltip title={title} placement="right">
        <ListItemButton onClick={setItem}>
          <ListItemIcon>
            <FontAwesomeIcon icon={icon} size="xl" />
          </ListItemIcon>
          <ListItemText primary={title} />
          {open ?
            <FontAwesomeIcon icon={faChevronUp} size="sm" /> :
            <FontAwesomeIcon icon={faChevronDown} size="sm" />}
        </ListItemButton>
      </Tooltip>
    )
  }

const ItemSubCategory:
  React.FC<{ link: string, title: string, icon: IconDefinition }> =
  ({ link, title, icon }) => {
    return (
      <Tooltip title={title} placement="right">
        <NavLink to={`${folderDefault}${link}`}
          className={({ isActive }) => (isActive ? "active" : "")}
          style={{ textDecoration: 'none', color: "#707070" }}>
          <List component="div" disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FontAwesomeIcon icon={icon} size="1x" />
              </ListItemIcon>
              <ListItemText primary={title} />
            </ListItemButton>
          </List>
        </NavLink>
      </Tooltip >)
  }


function Navbar() {
  const [isCatMantenimiento, setIsCatMantenimiento] = useState(false);
  const [isCatGraphics, setIsCatGraphics] = useState(false);

  dayjs.locale('es');

  return (
    <>
      {/* Mantenimiento */}
      {allowPermission(["ADMINISTRADOR"]) && <>
        <ItemCategory
          title="Mantenimiento"
          setItem={() => setIsCatMantenimiento(!isCatMantenimiento)}
          icon={faToolbox}
          open={isCatMantenimiento}
        />
        <Collapse in={isCatMantenimiento} timeout="auto" unmountOnExit>
          <ItemSubCategory
            link="/mantenimiento/usuarios"
            title="Usuario"
            icon={faUserCog}
          />
          <ItemSubCategory
            link="/mantenimiento/usuarios/eliminados"
            title="Usuarios Eliminados"
            icon={faUserSlash}
          />
          <ItemSubCategory
            link="/mantenimiento/cuerpo_educativo"
            title="Cuerpo Educatico"
            icon={faUserCog}
          />
          <ItemSubCategory
            link="/mantenimiento/privilegios"
            title="Privilegios"
            icon={faUserShield}
          />
          <ItemSubCategory
            link="/mantenimiento/categorias"
            title="Categorias"
            icon={faMoneyCheckAlt} // Cambié faGavel por faMoneyCheckAlt
          />
          <ItemSubCategory
            link="/mantenimiento/tipoVehiculo"
            title="Tipo Vehiculo"
            icon={faMoneyCheckAlt} // Cambié faGavel por faMoneyCheckAlt
          />
        </ Collapse>
      </>
      }
      <Divider />
      {/* Reportes */}
      {allowPermission(["ADMINISTRADOR"]) && <>
        <ItemCategory
          title="Reportes"
          setItem={() => setIsCatGraphics(!isCatGraphics)}
          icon={faChartSimple}
          open={isCatGraphics}
        />
        <Collapse in={isCatGraphics} timeout="auto" unmountOnExit>
          <ItemSubCategory
            link="/reporte/placasEscaneadas"
            title="Placas Escaneadas"
            icon={faMoneyCheckAlt} // Cambié faGavel por faMoneyCheckAlt
          />
          <ItemSubCategory
            link="/grafico/cantidad"
            title="Vehiculos"
            icon={faDisplay}
          />
          <ItemSubCategory
            link="/grafico/pie"
            title="Cuerpo Estudiantil"
            icon={faPeopleGroup}
          />
        </ Collapse>
      </>
      }
      <Divider />
    </>
  );
}

export default Navbar;