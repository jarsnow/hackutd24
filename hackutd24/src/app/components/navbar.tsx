"use client";
import React, { useState } from 'react';
import Link from 'next/link'

const NavBar = () => {

    const [isOpen, setIsOpen] = useState(false);

    return (

        <div className="  
        fixed w-1/5 h-full bg-blue-white border-r-2 content-center">

            <div className="w-full my-4 hover:bg-white text-blue text-center">
                <Link href="/dashboard">Dashboard</Link>
            </div>

            <div className="w-full my-4 hover:bg-white text-blue text-center">
                <Link href="/dashboard/data">Insert Data</Link>
            </div>

            <div className="w-full my-4 hover:bg-white text-blue text-center">
                <Link href="/dashboard/report">Report</Link>
            </div>



        </div>
    );

}

export default NavBar;