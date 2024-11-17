"use client";
import React, { useState } from "react";
import { useVisibilityContext } from "./visibilitycontext";

const tempCID = "QmV1jdjrN7Cg3YJd53GVN3xvuKmkXuSADxyDcnrDhb3xGA";

const Report: React.FC = () => {
  const { isReportVisible } = useVisibilityContext();
  const [fetching, setFetching] = useState(false);
  const [files, setFiles] = useState<string[]>([]);

  const fetchDataFromIPFS = async (folderCID: string) => {
    setFetching(true);

    // Use Pinata's public gateway
    const gatewayUrl = `https://gateway.pinata.cloud/ipfs/${folderCID}/`;

    try {
      const response = await fetch(gatewayUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch IPFS content: ${response.statusText}`);
      }

      // Parse the response to find files if it's a directory
      const textResponse = await response.text();
      const regex = /href="([^"]+)"/g; // Extract links from HTML response
      const extractedFiles: string[] = [];
      let match;

      while ((match = regex.exec(textResponse)) !== null) {
        const fileUrl = `${gatewayUrl}${match[1]}`;
        extractedFiles.push(fileUrl);
      }

      setFiles(extractedFiles);
    } catch (error) {
      console.error("Failed to fetch files from IPFS:", error);
    } finally {
      setFetching(false);
    }
  };

  return (
    <div className={`${isReportVisible ? "block" : "hidden"} flex-1 bg-dark`}>
      <div className="overscroll-none overflow-x-hidden bg-lighter-dark sticky top-0 shadow-md w-full p-4 content-center overflow-y-hidden">
        <p className="w-full text-2xl font-bold text-center text-white">
          Report for MONTH:
        </p>
      </div>
      <button
        className="border py-3 px-4 rounded-md"
        type="button"
        disabled={fetching || !tempCID}
        onClick={() => fetchDataFromIPFS(tempCID)}
      >
        {fetching ? "Fetching..." : "Get Report"}
      </button>

      <div className="flex flex-wrap justify-evenly mt-4">
        {files.length > 0 ? (
          files.map((file, index) => (
            <a
              key={index}
              href={file}
              target="_blank"
              rel="noopener noreferrer"
              className="border-4 rounded-xl m-4 p-2"
            >
              <img
                src={file}
                alt={`File ${index}`}
                className="w-1/3 object-contain"
              />
            </a>
          ))
        ) : (
          <p className="text-white mt-4">No files fetched yet.</p>
        )}
      </div>
    </div>
  );
};

export default Report;