"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Title: React.FC = () => {
    const { isTitleVisible } = useVisibilityContext();

    return (

        <div className={`${isTitleVisible ? "block" : "hidden"} flex-1 bg-gray-100 p-4`}>

                <p className="text-2xl font-bold">Title Here</p>

                <p>Get Started</p>

        </div>
    );

}

export default Title;