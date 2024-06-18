import { Navigate } from 'react-router-dom';
import { allowPermission, getInfoUser } from '../Tools/Auth';
import { folderDefault } from '../config';

const PrivateRoute: React.FC<{ element: React.ReactElement, onlyAdmin?: boolean }> = ({ element, onlyAdmin }) => {
  const isAuth = getInfoUser();
  const isAdmin = allowPermission(["ADMINISTRADOR"]);

  return (
    onlyAdmin ? (
      isAdmin ? element :
        (<Navigate to={`${folderDefault}/login`} />)
    ) : (isAuth ? element : (<Navigate to={`${folderDefault}/event/list`} />))
  );
};

export default PrivateRoute;