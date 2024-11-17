"use client";
import React, { useState, useEffect } from 'react';
import clsx from 'clsx'
import { useVisibilityContext } from './visibilitycontext';

const NavBar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const {toggleDataVisibility, toggleTitleVisibility, toggleReportVisibility} = useVisibilityContext();

    const tabs = [
        {name: "Dashboard", action: () => { toggleTitleVisibility(true); toggleDataVisibility(false); toggleReportVisibility(false); }}, 
        {name: "Insert Data", action: () => { toggleTitleVisibility(false); toggleDataVisibility(true); toggleReportVisibility(false); }}, 
        {name: "Report", action: () => { toggleTitleVisibility(false); toggleDataVisibility(false); toggleReportVisibility(true); }}];

        const handleClick = (index: number) => {
            setActiveTab(index);
            tabs[index].action();  
        };

    return (

        <div className="fixed w-1/5 h-full bg-blue-white border-r-2 content-center">
            <div className="absolute left-0 top-0 w-full transition-transform duration-300" 
            style={{transform: `translateY(${activeTab * 3}rem)`}}>

            </div>

            <div className="flex flex-col items-start">
                {tabs.map((tab, index) => (
                    
                <button
                    key={index}
                    className={clsx(
                        "relative z-10 w-full h-12 px-4 flex items-center text-left transition-all duration-300",
                        activeTab === index
                        ? "bg-blue"
                        : "bg-white"
                    )}
                    onClick={() => handleClick(index)}>
                {tab.name}
                </button>))}
                
            </div>



        </div>
    );

}

export default NavBar;