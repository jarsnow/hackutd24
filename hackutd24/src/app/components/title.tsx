"use client";
import Image from 'next/image';
import logo from './/../logo.png'
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Title: React.FC = () => {
    const { isTitleVisible } = useVisibilityContext();

    return (

        <div className={`${isTitleVisible ? "block" : "hidden"} 
        w-full flex-1 bg-dark p-4 flex justify-center items-center h-full flex-col`}>
            <div className='border border-8 rounded-xl border-white border-double'>

            <Image src={logo} width={500} height={500} alt='logo'/>

            </div>
            <p className='text-white m-4'>Developed for HackUTD 2024 by Andrew Huang, John Rader, and Cooper Wright</p>
        </div>
    );

}

export default Title;