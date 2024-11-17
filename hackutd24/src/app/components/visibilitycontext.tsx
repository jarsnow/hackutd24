"use client";
import React, {createContext, useContext, useState } from 'react'

interface VisibilityContextProps {
    isTitleVisible: boolean;
    isDataVisible: boolean;
    isReportVisible: boolean;
    toggleTitleVisibility: () => void;
    toggleDataVisibility: () => void;
    toggleReportVisibility: () => void;
}

const VisibilityContext = createContext<VisibilityContextProps | undefined>(undefined); 

export const VisibilityProvider: React.FC<{children: React.ReactNode }> = ({children}) => {
    const [isTitleVisible, setIsTitleVisible] = useState<boolean>(true);
    const [isDataVisible, setIsDataVisible] = useState<boolean>(false);
    const [isReportVisible, setIsReportVisible] = useState<boolean>(false);

    const toggleTitleVisibility = () => setIsTitleVisible((prev) => !prev);
    const toggleDataVisibility = () => setIsDataVisible((prev) => !prev);
    const toggleReportVisibility = () => setIsReportVisible((prev => !prev));

    return(
        <VisibilityContext.Provider 
        value={{isTitleVisible, isDataVisible, isReportVisible, toggleDataVisibility, toggleTitleVisibility, toggleReportVisibility}}>
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