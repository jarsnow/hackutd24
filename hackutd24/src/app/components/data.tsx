"use client";

import React from 'react';
import { useState } from 'react';
import { useVisibilityContext } from "./visibilitycontext";

const Data: React.FC = () =>{
    const { isDataVisible } = useVisibilityContext();

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);


    const pinImageToIPFS = async (file: File) => {

        try {
            if (!file) {
                alert("No file selected");
                return;
            }
            
            setUploading(true);
            //create form data
            const formData = new FormData();
            formData.append("file", file);

            //obtain response from the fetch call (pinning form data to ipfs)
            const response = await fetch(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${process.env.NEXT_PUBLIC_PINATA_JWT}`,
                    },
                    body: formData
                },

            );

            //if the response worked, then returns ipfs://CID
            if (response.ok){
                const responseData = await response.json();
                console.log("Image pinned successfully", responseData);

                const imageURL = `ipfs://${responseData.IpfsHash}`;
                
                return imageURL;

            } else {
                console.error("Failed to pin file", response.statusText);
            }
        } catch (error) {
            console.log("Failed to upload image to IPFS: ", error);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
    };
    
    console.log("isDataVisible:", isDataVisible);
    return (

        <div className={`${isDataVisible ? "block" : "hidden"}flex-1 bg-gray-100 p-4`}>

                <p className="text-2xl font-bold">Data Here</p>
                <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
                    <input type="file" onChange={handleChange} />

                    <button type="button" disabled={uploading || !file} onClick={() => pinImageToIPFS(file!)}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                    {/* Add a conditional looking for the signed url and use it as the source */}
                    {url && <img src={url} alt="Image from Pinata" />}
                

            </main>


        </div>
    );

}

export default Data;