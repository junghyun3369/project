import { createContext, useContext, useState, useEffect } from "react"
import { useCookies } from 'react-cookie';
import { decode, encode } from '@utils/Common.js'
import Vite from '@assets/vite.svg'
import { jwtDecode } from 'jwt-decode';

export const RootContext = createContext()

const RootProvider = ({children}) => {
  const [isUser, setIsUser] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [isEmail, setIsEmail] = useState(false)
  const [access, setAccess] = useState(false)
  const [isFreeView, setIsFreeView] = useState(false)
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

  const baseUrl = import.meta.env.VITE_APP_GATEWAY_URL || 'http://localhost:7000';
  const getFile = (fileNo) => {
    if(fileNo == null) return Vite
    return baseUrl + "/oauth/file/u/" + fileNo
  }

  const getUserNo = () => {
    if(isStorage("access")) {
      const decoded = jwtDecode(getStorage("access"));
      return decoded.userNo;
    } else {
      return 0;
    }
  }

  useEffect(() => {
    if(isStorage("access")) setAccess(true)
  }, [])

  return (
    <RootContext.Provider value={{ access, setAccess, isUser, isLogin, isSignUp, isEmail, modalEvent, closeEvent, isValidEmail, setStorage, getStorage, removeStorage, isStorage, getFile, getUserNo, isFreeView, setIsFreeView }}>
      {children}
    </RootContext.Provider>
  )
}

export const useRoot = () => useContext(RootContext);

export default RootProvider