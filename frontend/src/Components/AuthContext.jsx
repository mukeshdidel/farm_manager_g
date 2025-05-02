import { createContext, useState, useContext , useEffect} from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem('auth_token') || null);
  const [userInfo, setUserInfo] = useState({});

  

  return (
    <AuthContext.Provider value={{ token, setToken, user, setUser, userInfo, setUserInfo }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
