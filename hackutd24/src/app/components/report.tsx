"use client";
import React, { useState } from "react";
import { useVisibilityContext } from "./visibilitycontext";

const KWHCID = "QmVD9NNcvLeFTNPHeJtsYtnv2rof8nC3wH4pfeVEL27R2J";
const KWHWTHCID = "QmbpWer5dpCyguNpZ3aYX7dtuLCVJTUq5sbFeJcQ8CmXwX";
const KWHCOLCID = "QmSRU357v83LfT1BPrNFaVweC1LJRBMQANkhug5U14JzwX";
const KWHLGTCID = "QmfAeXeedwe9nz9EtX4ZCRVWPXtwYUXq1TV5WhrUrZFG9V";
const Llama = "QmTPtMtZrSwputVwUaj1gzrJL9YWcqReaoMyjckY7jMzCv";

const Report: React.FC = () => {
  const { isReportVisible } = useVisibilityContext();
  const [fetching, setFetching] = useState(false);
  const [files, setFiles] = useState<string[]>([]);


  const fetchTextFromIPFS = async () => {
    const gatewayUrl = `https://salmon-managerial-hippopotamus-559.mypinata.cloud/ipfs/${Llama}`;
    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.statusText}`);
      }
      const text = await response.text(); // Fetch the text content
      console.log("Fetched text:", text); // Use or store the fetched text
      return text;
    } catch (error) {
      console.error("Failed to fetch files from IPFS:", error);
      return null;
    }
  };
  const fetchDataFromIPFS = async (folderCID: string) => {
    const gatewayUrl = `https://salmon-managerial-hippopotamus-559.mypinata.cloud/ipfs/${folderCID}`;
    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.statusText}`);
      }
      return response.url; // Return the file URL
    } catch (error) {
      console.error("Failed to fetch files from IPFS:", error);
      return null; // Return null on failure
    }
  };

  const fetchAllData = async () => {
    setFetching(true);
    try {
      const cids = [KWHCID, KWHWTHCID, KWHCOLCID, KWHLGTCID]; // Add all CIDs to fetch here
      const fetchedFiles = await Promise.all(
        cids.map((cid) => fetchDataFromIPFS(cid))
      );
      // Filter out null responses and set state
      setFiles(fetchedFiles.filter((file) => file !== null) as string[]);
    } catch (error) {
      console.error("Error fetching multiple files:", error);
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
          disabled={fetching}
          onClick={async () => {
            await fetchTextFromIPFS();
            await fetchAllData();
          }}
        >
          {fetching ? "Fetching..." : "Get Report"}
        </button>
      </div>
      
      <div className="flex flex-wrap mt-3">
        {files.length > 0 ? (
          files.map((file, index) => (
            <div key={index} className="rounded-xl m-1 text-white">
              <img
                src={file}
                alt={`File ${index}`}
                className="w-3/5"
              />
            </div>
          ))
        ) : (
          <p className="text-white mt-4">No files fetched yet.</p>
        )}
      </div>
      
      
    </div>
  );
};

export default Report;
