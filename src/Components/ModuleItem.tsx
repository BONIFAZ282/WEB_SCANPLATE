// ModuleItem.tsx
import React from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { Link } from 'react-router-dom';

interface ModuleItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  onClick: () => void;
  iconColor: string; // Nueva prop para el color del ícono
}


const ModuleItem: React.FC<ModuleItemProps> = ({ to, icon, text, isActive, onClick, iconColor }) => {
  return (
    <ListItem
      button
      component={Link}
      to={to}
      sx={{
        "&:hover": {
          color: isActive ? 'rgba(168, 37, 24)' : 'inherit',
        },
        color: isActive ? 'rgba(168, 37, 24)' : 'inherit',
      }}
      onClick={onClick}
    >
      <ListItemIcon sx={{ color: iconColor }}>{icon}</ListItemIcon>
      <ListItemText primary={text} />
    </ListItem>
  );
};

export default ModuleItem;
