import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [Token, setToken] = useState(null)
    const [Splaced, setSplaced] = useState(false)

    const login = () => {
        setSplaced(true)
        setToken("yes");
        AsyncStorage.setItem('userToken', 'yes');
        setSplaced(false)
    }
    const logout = () => {
        setSplaced(true)
        setToken(null);
        AsyncStorage.removeItem('userToken');
        setSplaced(false)
    }

    const IsLoggedIn = async () => {
        try {
            setSplaced(true)
            let usertoken = await AsyncStorage.getItem('userToken')
            setToken(usertoken)
            setSplaced(false)
        } catch (e) {
            console.log(e)
        }
    }
    useEffect(() => {
        IsLoggedIn();
    }, []);
    return (
        <AuthContext.Provider value={{ login, logout, Token, Splaced }}>
            {children}
        </AuthContext.Provider>


    );
}