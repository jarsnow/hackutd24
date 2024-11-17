"use client";
import React, { useState } from 'react';
import Link from 'next/link'
import clsx from 'clsx'
import { useVisibilityContext } from './visibilitycontext';
import { Toggle } from '@chakra-ui/react';

const NavBar = () => {

    const [activeTab, setActiveTab] = useState(0);
    const {toggleDataVisibility, toggleTitleVisibility, toggleReportVisibility} = useVisibilityContext();

    const tabs = [
        {name: "Dashboard", path: "/dashboard", action: toggleTitleVisibility}, 
        {name: "Insert Data", path: "/dashboard/data", action: toggleDataVisibility}, 
        {name: "Report", path: "/dashboard/report", action: toggleReportVisibility}];

    
    const handleClick = (index:number) => {
        tabs[index].action();
        setActiveTab(index);
    }

    return (

        <div className="fixed w-1/5 h-full bg-blue-white border-r-2 content-center">
            <div className="absolute left-0 top-0 w-full transition-transform duration-300" 
            style={{transform: `translateY(${activeTab * 3}rem)`}}>

            </div>

            <div className="flex flex-col items-start">
                {tabs.map((tab, index) => (
                    
                <Link 
                    key={index}
                    href={tab.path}
                    className={clsx(
                        "relative z-10 w-full h-12 px-4 flex items-center text-left transition-all duration-300",
                        activeTab === index
                        ? "bg-blue"
                        : "bg-white"
                    )}
                    onClick={() => handleClick(index)}>
                {tab.name}
                </Link>))}
                
            </div>



        </div>
    );

}

export default NavBar;