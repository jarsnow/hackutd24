"use client";
import React, { useState } from "react";
import { useVisibilityContext } from "./visibilitycontext";

//QmPGB3a8g6MbjivpTVxjPHDsLrbL1sn1gQYzUvJz8wSNWY
//"QmV1jdjrN7Cg3YJd53GVN3xvuKmkXuSADxyDcnrDhb3xGA"
const tempCID = "QmV1jdjrN7Cg3YJd53GVN3xvuKmkXuSADxyDcnrDhb3xGA";
const KWHCID = "QmVD9NNcvLeFTNPHeJtsYtnv2rof8nC3wH4pfeVEL27R2J"

const CID = [KWHCID];

const Report: React.FC = () => {
  const { isReportVisible } = useVisibilityContext();
  const [fetching, setFetching] = useState(false);
  const [files, setFiles] = useState<string[]>([]);
  const [file, setFile] = useState<string>();
  
const fetchDataFromIPFS = async (folderCID: string) => {
    setFetching(true);
  
    // Pinata's public gateway URL
    const gatewayUrl = `https://salmon-managerial-hippopotamus-559.mypinata.cloud/ipfs/${folderCID}`;
  
    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.statusText}`);
      }
  
      // Get the response body as text (this is likely HTML content)
      //const textResponse = await response.text();
  
      // Log the full HTML to examine the structure
      //console.log(textResponse);  // Check if the content has a directory listing
  
      // Extract file links from the HTML using a more specific regex
      /*const regex = /href="([^"]+\.(jpg|jpeg|png|gif|bmp|webp))"/g; // Match image file extensions
      const extractedFiles: string[] = [];
      let match;
  
      // Use a loop to find all image file links
      while ((match = regex.exec(textResponse)) !== null) {
        // Construct the full URL of the file
        const fileUrl = `${gatewayUrl}${match[1]}`;
        extractedFiles.push(fileUrl);
      }*/
  
      // Log the extracted file URLs
      // console.log("Extracted Files:", extractedFiles);
  
      // Set the state with the image file URLs
      setFile(response.url);
  
    } catch (error) {
      console.error("Failed to fetch files from IPFS:", error);
    } finally {
      setFetching(false);
    }
  };


  return (
    <div className={`${isReportVisible ? "block" : "hidden"} flex-1 bg-dark h-full`}>
      <div className="overscroll-none overflow-x-hidden bg-lighter-dark sticky top-0 shadow-md w-full p-4 content-center overflow-y-hidden">
        <p className="w-full text-2xl font-bold text-center text-white">
          Report for MONTH:
        </p>
      </div>
      <div className="w-full text-center rounded-md p-2 text-white">
      <button
        className="border-4 py-3 px-4 rounded-lg text-white"
        type="button"
        disabled={fetching || !KWHCID}
        onClick={() => fetchDataFromIPFS(KWHCID)}
      >
        {fetching ? "Fetching..." : "Get Report"}
      </button>
      </div>
      
        <div className='flex flex-wrap justify-evenly'>
                    <img className='rounded-xl m-8 w-1/3' src={file}></img>
                    <img className='rounded-xl m-8 w-1/2' src={file}></img>
                    <img className='rounded-xl m-4 w-1/4' src='https://ichef.bbci.co.uk/images/ic/1920xn/p0k3rf8d.jpg.webp'></img>
        </div>

    
       
      {/*
        <div className="flex flex-wrap justify-evenly mt-4">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div>
            <a
              key={index}
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 rounded-xl m-4 p-2"
            >

            </a>
            <img
              src={file}
              alt={`File ${index}`}
              className="w-1/3 object-contain"
            />
            </div>

          ))
        ) : (
          <p className="text-white mt-4">No files fetched yet.</p>
        )} 
      </div> */}
    </div>
  );
};

export default Report;


//https://salmon-managerial-hippopotamus-559.mypinata.cloud/ipfs/