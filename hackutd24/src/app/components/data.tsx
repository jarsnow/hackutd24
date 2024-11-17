"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Data: React.FC = () =>{
    const { isDataVisible } = useVisibilityContext();
    console.log("isDataVisible:", isDataVisible);
    return (

        <div className={`${isDataVisible ? "block" : "hidden"}flex-1 bg-gray-100 p-4`}>

                <p className="text-2xl font-bold">Data Here</p>

        </div>
    );

}

export default Data;