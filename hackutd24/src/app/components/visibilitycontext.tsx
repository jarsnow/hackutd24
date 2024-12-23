"use client";
import React, {createContext, useContext, useState } from 'react'

interface VisibilityContextProps {
    isTitleVisible: boolean;
    isDataVisible: boolean;
    isReportVisible: boolean;
    isResultVisible: boolean;
    toggleTitleVisibility: (value: boolean) => void;
    toggleDataVisibility: (value: boolean) => void;
    toggleReportVisibility: (value: boolean) => void;
    toggleResultVisibility: (value: boolean) => void;
}

const VisibilityContext = createContext<VisibilityContextProps | undefined>(undefined); 

export const VisibilityProvider: React.FC<{children: React.ReactNode }> = ({children}) => {
    const [isTitleVisible, setIsTitleVisible] = useState<boolean>(true);
    const [isDataVisible, setIsDataVisible] = useState<boolean>(false);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);
    const [isResultVisible, setIsResultVisible] = useState<boolean>(false);

    const toggleTitleVisibility = (value: boolean) => setIsTitleVisible(value);
    const toggleDataVisibility = (value: boolean) => setIsDataVisible(value);
    const toggleReportVisibility = (value: boolean) => setIsReportVisible(value);
    const toggleResultVisibility = (value: boolean) => setIsResultVisible(value);

    return(
        <VisibilityContext.Provider 
        value={{isTitleVisible, isDataVisible, isReportVisible, isResultVisible, toggleDataVisibility, toggleTitleVisibility, toggleReportVisibility, toggleResultVisibility}}>
            {children}
        </VisibilityContext.Provider>
    );

}

export const useVisibilityContext = (): VisibilityContextProps => {
    const context = useContext(VisibilityContext)
    if (!context) {
        throw new Error("no Visibility Provider")
    }

    return context;
}