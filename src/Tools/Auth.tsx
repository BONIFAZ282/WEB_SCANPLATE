import { iLUsuarios } from "../iType";

const keyLocal = "session";

const setUserInfo = (info: iLUsuarios) => {
  localStorage.setItem(keyLocal, JSON.stringify(info));
}

const getInfoUser = (): iLUsuarios | undefined => {
  let haveUser = localStorage.getItem("session");
  if (haveUser) {
    return JSON.parse(haveUser) as iLUsuarios;
  }
  return undefined;
}

const allowPermission = (TYPE_ALLOW: string[]): boolean => {
  let info = getInfoUser();
  let result = false;

  TYPE_ALLOW.forEach((item)=>{
    if (item === info?.NOMBRE_PRIVILEGIO) result = true;
  })

  return result;
}

export { setUserInfo, getInfoUser, allowPermission };
