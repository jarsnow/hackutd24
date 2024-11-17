"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Title: React.FC = () => {
    const { isTitleVisible } = useVisibilityContext();

    return (

        <div className={`${isTitleVisible ? "block" : "hidden"} 
        w-full flex-1 bg-gray-100 p-4 flex justify-center items-center h-full`}>

                <p className="animate-fadein text-2xl font-bold text-6xl">
                    Watt Wise
                </p>

        </div>
    );

}

export default Title;