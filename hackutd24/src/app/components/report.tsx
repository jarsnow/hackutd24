"use client";
import React, { useState } from 'react'
import { useVisibilityContext } from "./visibilitycontext";

const tempCID = "QmV1jdjrN7Cg3YJd53GVN3xvuKmkXuSADxyDcnrDhb3xGA"

const Report: React.FC = () => {
    const { isReportVisible } = useVisibilityContext();
    const [gatewayUrl, setGatewayUrl] = useState(null);
    const [dataFolder, setDataFolder] = useState(null);
    const [plotsFolder, setplotsFolder] = useState(null);
    const [dataFile, setDataFile] = useState<File[]>([]);
    const [plotFile, setPlotFile] = useState<File[]>([]);
    const [fetching, setFetching] = useState(false);

    const fetchDataFromIPFS = async (folderCID: string) => {
        setFetching(true);

        // Obtain the gateway URL from the local environment
        const gatewayUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/ipfs/${folderCID}`;
        const dataUrl = `${gatewayUrl}/data/`;
        const plotsUrl = `${gatewayUrl}/plots/`;
    
        try {
            const dataResponse = await fetch(dataUrl);
            const plotsResponse = await fetch(plotsUrl);
    
            if (!dataResponse.ok) {
                throw new Error(`Failed to fetch data folder: ${dataResponse.statusText}`);
            }
            if (!plotsResponse.ok) {
                throw new Error(`Failed to fetch plots folder: ${plotsResponse.statusText}`);
            }
    
            const dataText = await dataResponse.text();
            const plotsText = await plotsResponse.text();
    
            const regex = /href="([^"]+)"/g;
    
            let newDataFiles: File[] = [];
            let newPlotFiles: File[] = [];
    
            // Parse dataText for data files and download them
            let match1;
            while ((match1 = regex.exec(dataText)) !== null) {
                const fileUrl = match1[1];
                const fileResponse = await fetch(fileUrl); // Fetch the file content
                if (fileResponse.ok) {
                    const fileBlob = await fileResponse.blob(); // Convert the response to a Blob
                    const fileName = fileUrl.split('/').pop() || 'unknown'; // Get file name from URL
                    const file = new File([fileBlob], fileName, { type: fileBlob.type });
                    newDataFiles.push(file); // Add File object to the array
                }
            }
    
            // Parse plotsText for plot files and download them
            let match2;
            while ((match2 = regex.exec(plotsText)) !== null) {
                const fileUrl = match2[1];
                const fileResponse = await fetch(fileUrl); // Fetch the file content
                if (fileResponse.ok) {
                    const fileBlob = await fileResponse.blob(); // Convert the response to a Blob
                    const fileName = fileUrl.split('/').pop() || 'unknown'; // Get file name from URL
                    const file = new File([fileBlob], fileName, { type: fileBlob.type });
                    newPlotFiles.push(file); // Add File object to the array
                }
            }
    
            // Update the state with the new files
            setDataFile(prevDataFile => [...prevDataFile, ...newDataFiles]);
            setPlotFile(prevPlotFile => [...prevPlotFile, ...newPlotFiles]);
    
            console.log("Data files:", newDataFiles);
            console.log("Plot files:", newPlotFiles);
    
        } catch (error) {
            console.log("Failed to fetch from IPFS: ", error);
        } finally {
            setFetching(false);
        }
    };
    
    



    return (

        <div className={`${isReportVisible ? "block" : "hidden"} flex-1 bg-dark`}>

<div className="overscroll-none overflow-x-hidden bg-lighter-dark sticky top-0 shadow-md w-full p-4 content-center overflow-y-hidden">
            <p className="w-full text-2xl font-bold text-center text-white">Report for MONTH:</p>
            </div>
                <button className="border py-3 px-4 rounded-md "
                        type="button" 
                        disabled={fetching || !tempCID} 
                        onClick={() => fetchDataFromIPFS(tempCID)}>
                        {fetching ? "Fetching..." : "Get Report"}</button>

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