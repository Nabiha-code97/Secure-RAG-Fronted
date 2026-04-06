import {createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = ({children})=>{
    const navigate = useNavigate();
    const[user, setUser] = useState(null)
    const[isAdmin, setIsAdmin] = useState(false)
    const[token, setTokenState] = useState(() => localStorage.getItem('auth_token') || null)

    const setToken = (t) => {
        setTokenState(t)
        if (t) {
            localStorage.setItem('auth_token', t)
        } else {
            localStorage.removeItem('auth_token')
        }
    }

    const value = {navigate, user, setUser, isAdmin, setIsAdmin, token, setToken}
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}
export const useAppContext = ()=>{
    return useContext(AppContext)
}