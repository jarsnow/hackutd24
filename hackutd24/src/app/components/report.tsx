"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Report: React.FC = () => {
    const { isReportVisible } = useVisibilityContext();

    return (

        <div className={`${isReportVisible ? "block" : "hidden"} flex-1 bg-gray-100 p-4`}>

                <p className="text-2xl font-bold">Report</p>

                <p>Get Started</p>

        </div>
    );

}

export default Report;