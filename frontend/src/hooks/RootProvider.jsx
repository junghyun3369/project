import { createContext, useContext, useState, useEffect } from "react"
import { useCookies } from 'react-cookie';
import { decode, encode } from '@utils/Common.js'

export const RootContext = createContext()

const RootProvider = ({children}) => {
  const [isUser, setIsUser] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isEmail, setIsEmail] = useState(false)
  const [cookies, setCookie, removeCookie] = useCookies(['ck']);

  const modalEvent = (target) => {
    closeEvent()
    switch (target) {
      case "Login":
        setIsLogin(true)
        break;
      case "SignUp":
        setIsSignUp(true)
        break;
      case "Email":
        setIsEmail(true)
        break;
      case "User":
        setIsUser(true)
        break;
    }
  }
  const closeEvent = () => {
    setIsLogin(false)
    setIsSignUp(false)
    setIsEmail(false)
    setIsUser(false)
  }
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  const setStorage = (name, token) => {
    setCookie(name, encode(token));
    return true;
  }
  
  const getStorage = (name) => {
    return cookies[name] == undefined ? null : decode(cookies[name]);
  }
  
  const isStorage = (name) => {
    return getStorage(name) === null ? false : true;
  }
  
  const removeStorage = (name) => {
    removeCookie(name);
    location.reload();
  }

  useEffect(() => {
    
  }, [])

  return (
    <RootContext.Provider value={{ isUser, isLogin, isSignUp, isEmail, modalEvent, closeEvent, isValidEmail, setStorage, getStorage, removeStorage, isStorage }}>
      {children}
    </RootContext.Provider>
  )
}

export const useRoot = () => useContext(RootContext);

export default RootProvider