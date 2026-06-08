"use client"

import { AppContextType, AppProviderProps, User } from "@/types"
import React, { createContext, useContext, useEffect, useState } from "react"
import { Toaster } from "react-hot-toast";
import Cookies from "js-cookie";
import axios from "axios";

export const utils_service = "http://localhost:5001";
export const auth_service = "http://localhost:5000";
export const user_service = "http://localhost:5002";
export const job_service = "http://localhost:5003";

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<AppProviderProps> = ({children}) =>{
    const [user, setUser] = useState<User | null>(null);
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);

    const token = Cookies.get("token")

    async function fetchUser() {
        try {
            const { data } = await axios.get(`${user_service}/api/user/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            setUser(data)
            setIsAuth(true)

        } catch (error) {
            console.log(error)
            setIsAuth(false)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        fetchUser()
    }, [])

    return <AppContext.Provider value={{ user, loading, btnLoading, setUser, isAuth,setIsAuth, setLoading}}>
            {children}
            <Toaster/>
        </AppContext.Provider>
}

export const useAppData = (): AppContextType => {
    const context = useContext(AppContext)
    if(!context){
        throw new Error("useAppData must be used within AppProvider")
    }
    return context;
}