import jwt_decode from "jwt-decode";

const storage = sessionStorage

export const TOKEN_KEY = "@agenciacuca-Token";
export const isAuthenticated = () => storage.getItem(TOKEN_KEY) !== null;
export const getToken = () => storage.getItem(TOKEN_KEY);
export const getPlaload = () => {
  if( !isAuthenticated() ) return null
  const plaload = jwt_decode(storage.getItem(TOKEN_KEY))
  console.log(plaload);
  return plaload
}
  export const login = (token) => {
  storage.setItem(TOKEN_KEY, token);
};
export const logout = () => {
  storage.removeItem(TOKEN_KEY);
};

