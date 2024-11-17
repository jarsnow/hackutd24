"use client";
import React from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const Report: React.FC = () => {
    const { isReportVisible } = useVisibilityContext();

    

    const fetchDataFromIPFS = async (folderCID: string) => {
        
        //need to obtain CID from the pythonAPI

        //obtain gateway from the local environment 
        const gatewayUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${folderCID}`;

        try {
            const response = await fetch(gatewayUrl);
            if (!response.ok) {
                throw new Error(`Failed to fetch folder: ${response.statusText}`)
            }
            const folderContents = await response.text();
            const file1 = 
            console.log(folderContents);
        } catch (error) {
            console.log("Failed to upload image to IPFS: ", error);
        } finally {
            
        }
    }

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