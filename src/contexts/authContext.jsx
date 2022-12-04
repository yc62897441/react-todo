import { useState, useEffect, useContext, createContext } from 'react';
import { useLocation } from 'react-router-dom';
import { register, login, checkPermission } from '../api/auth';
import * as jwt from 'jsonwebtoken';

const defaultAuthContext = {
  isAuthenticated: false, // 使用者是否登入的判斷依據，預設為 false，若取得後端的有效憑證，則切換為 true
  currentMember: null, // 當前使用者相關資料，預設為 null，成功登入後就會有使用者資料
  register: null, // 註冊方法
  login: null, // 登入方法
  logout: null, // 登入方法
};

const AuthContext = createContext(defaultAuthContext);
export const useAuth = () => useContext(AuthContext); 

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [payload, setPayload] = useState(null);
  const pathName = useLocation();

  useEffect(() => {
    async function checkTokenIsValid() {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          setIsAuthenticated(false);
          setPayload(null);
        }
        const result = await checkPermission(authToken);
        if (result) {
          setIsAuthenticated(true);
          const tempPayload = jwt.decode(authToken);
          setPayload(tempPayload);
        } else {
          setIsAuthenticated(false);
          setPayload(null);
        }
      } catch (error) {
        console.error(error);
      }
    }
    checkTokenIsValid();
  }, [pathName]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: isAuthenticated,
        currentMember: payload && {
          id: payload.sub,
          name: payload.name,
        },
        register: async (data) => {
          const { success, authToken } = await register({
            username: data.username,
            email: data.email,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setIsAuthenticated(true);
            setPayload(tempPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }
          return success;
        },
        login: async (data) => {
          const { success, authToken } = await login({
            username: data.username,
            password: data.password,
          });
          const tempPayload = jwt.decode(authToken);
          if (tempPayload) {
            setIsAuthenticated(true);
            setPayload(tempPayload);
            localStorage.setItem('authToken', authToken);
          } else {
            setIsAuthenticated(false);
            setPayload(null);
          }
          return success;
        },
        logout: () => {
          localStorage.removeItem('authToken');
          setIsAuthenticated(false);
          setPayload(null);
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
