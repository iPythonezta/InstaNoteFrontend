import { useContext, createContext, useState  } from "react";

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState(false);


  return (
    <UserContext.Provider value={{ user, token, setUser, setToken, loading, setLoading, login, setLogin }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);
export { UserProvider };