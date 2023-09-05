import { createContext } from 'react';
// AuthContext 组件， 认证环境变量信息
export const AuthContext = createContext({
  isLoggedIn: false,
  login: () => {},
  logout: () => {}
});
