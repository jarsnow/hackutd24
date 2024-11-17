
"use client";
import NavBar from '@/app/components/navbar';
import Title from '@/app/components/title';
import Data from '@/app/components/data';
import React, { useState, useContext, createContext } from "react";
import { VisibilityProvider } from '../components/visibilitycontext';

export default function DashboardPage() {


    return (
        <VisibilityProvider>
            <div className="items-stretch flex">
                <NavBar />

                <div className="ml-[20%] flex-1">

                    <Title />
                    <Data />

                </div>

            </div>
        </VisibilityProvider>
    );
}

