"use client";
import NavBar from '@/app/components/navbar';
import Title from '@/app/components/title';
import Data from '@/app/components/data';
import Report from '@/app/components/report';
import Result from '@/app/components/result';
import React, { useState, useContext, createContext } from "react";
import { VisibilityProvider } from '../components/visibilitycontext';
import { useVisibilityContext } from '../components/visibilitycontext';

export default function DashboardPage() {
    const {isTitleVisible, isDataVisible, isReportVisible, isResultVisible} = useVisibilityContext();

    return (
            <div className="h-screen flex">
                <NavBar />

                <div className="ml-[20%] flex-1">

                    {isTitleVisible && <Title />}

                    {isDataVisible && <Data />}

                    {isReportVisible && <Report />}

                    {isResultVisible && <Result />}

                </div>

            </div>
    );
}

