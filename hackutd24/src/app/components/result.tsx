"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Result: React.FC = () => {
    const { isResultVisible } = useVisibilityContext();

    return (

        <div className={`${isResultVisible ? "block" : "hidden"} 
        w-full flex-1 bg-gray-100 p-4 flex justify-center items-center h-full`}>

                <p className="text-2xl font-bold">
                    Result Here
                </p>

        </div>
    );

}

export default Result;