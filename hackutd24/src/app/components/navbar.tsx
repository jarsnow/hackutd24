"use client";

import Image from 'next/image';
import logo from './/../logo.png'
import React, { useState, useEffect } from 'react';
import clsx from 'clsx'
import { useVisibilityContext } from './visibilitycontext';
import Report from './report';

const NavBar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const {toggleDataVisibility, toggleTitleVisibility, toggleReportVisibility, toggleResultVisibility} = useVisibilityContext();

    const tabs = [
        {name: "Dashboard", action: () => { toggleTitleVisibility(true); toggleDataVisibility(false); toggleReportVisibility(false); toggleResultVisibility(false)}}, 
        {name: "Insert Data", action: () => { toggleTitleVisibility(false); toggleDataVisibility(true); toggleReportVisibility(false); toggleResultVisibility(false)}}, 
        {name: "Report", action: () => { toggleTitleVisibility(false); toggleDataVisibility(false); toggleReportVisibility(true); toggleResultVisibility(false)}}];


        const handleClick = (index: number) => {
            setActiveTab(index);
            tabs[index].action();  
        };

    return (

        
        <div className="fixed w-1/5 h-full bg-lighter-dark border-r-4 border-gray">
            <div className="absolute left-0 top-0 w-full transition-transform duration-300" 
            style={{transform: `translateY(${activeTab * 3}rem)`}}>

            </div>

            <div>
                <Image src={logo} width={500} height={500} alt='logo'/>
            </div>
            <div className="flex flex-col items-start">
                {tabs.map((tab, index) => (
                <button
                    key={index}
                    className={clsx(
                        "relative z-10 w-full h-12 px-4 flex items-center text-left transition-all duration-300 text-white",
                        activeTab === index
                        ? "bg-light-purple text-black"
                        : "bg-lighter-dark hover:bg-purple hover:text-black"
                    )}
                    onClick={() => handleClick(index)}>
                {tab.name}
                </button>))}
                
            </div>



        </div>
    );

}

export default NavBar;