"use client";
import Image from 'next/image';
import logo from './/../logo.png'
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Title: React.FC = () => {
    const { isTitleVisible } = useVisibilityContext();

    return (

        <div className={`${isTitleVisible ? "block" : "hidden"} 
         w-full items-center justify-center flex-1 bg-dark p-2 flex h-full flex-col`}>
            <div className='border border-8 rounded-xl border-white border-double flex flex-row flex-wrap items-center'>

            <Image src={logo} width={500} height={500} alt='logo'/>
            <div>
            <p className='p-4 text-white border-l-4'>We worked to develop a household<br></br> electricity monitoring web app.<br></br>
            Simply upload your data and we'll provide<br></br> data visualization, comparisons, and suggustions </p>
            <br></br><br></br>
            <p className='text-white m-4'>Developed for HackUTD 2024 by <br></br>Andrew Huang, John Rader, and Cooper Wright</p>
            </div>
            
            </div>
        </div>
    );

}

export default Title;