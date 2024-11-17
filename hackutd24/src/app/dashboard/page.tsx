
"use client";
import NavBar from '@/app/components/navbar';
import Title from '@/app/components/title';
import Data from '@/app/components/data';
import Report from '@/app/components/report';
import React, { useState, useContext, createContext } from "react";
import { VisibilityProvider } from '../components/visibilitycontext';
import { useVisibilityContext } from '../components/visibilitycontext';

export default function DashboardPage() {
    const {isTitleVisible, isDataVisible, isReportVisible} = useVisibilityContext();

    return (
            <div className="items-stretch flex">
                <NavBar />

                <div className="ml-[20%] flex-1">

                    {isTitleVisible && <Title />}

                    {isDataVisible && <Data />}

                    {isReportVisible && <Report />}

                </div>

            </div>
    );
}

