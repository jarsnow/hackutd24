"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Report: React.FC = () => {
    const { isReportVisible } = useVisibilityContext();

    return (

        <div className={`${isReportVisible ? "block" : "hidden"} flex-1 bg-gray-100`}>

                <p className="text-2xl font-bold">Report</p>

                <p>Get Started</p>

                <div className='flex flex-wrap justify-evenly'>
                    <img className='border-4 rounded-xl m-8 w-1/2' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                    <img className='border-4 rounded-xl m-8 w-1/3' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                    <img className='border-4 rounded-xl m-4 w-2/5' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                    <img className='border-4 rounded-xl m-8 w-2/5' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                    <img className='border-4 rounded-xl m-4 w-1/4' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                    <img className='border-4 rounded-xl m-8 w-1/4' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
                </div>

        </div>
    );

}

export default Report;