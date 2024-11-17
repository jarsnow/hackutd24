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
        } finally {
            setUploading(false);
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
    };
    
    console.log("isDataVisible:", isDataVisible);
    return (

        <div className={`${isDataVisible ? "block" : "hidden"}
            flex-1 bg-gray-100 w-full min-h-screen flex flex-col overscroll-none`}>
            
            <div className="overscroll-none overflow-x-hidden bg-white sticky top-0 shadow-md w-full p-4 content-center overflow-y-hidden">
                <p className="w-full text-2xl font-bold text-center">Insert Data:</p>
            </div>
            
            <main className="my-5 w-full min-h-screen m-auto flex flex-col items-center overflow-y-auto space-y-8">
                    <input className="w-full max-w-xs text-center border border-gray rounded-md p-2" type="file" onChange={handleChange} />

                    {/* form here? */}


                    <form className="max-w-sm mx-auto">
                    <div className="mb-5">
                        <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                        <input type="email" id="email" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@flowbite.com" required />
                    </div>
                    <div className="mb-5">
                        <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
                        <input type="password" id="password" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                    </div>
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember me</label>
                    </div>
                    <button type="submit" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                    </form>


                    <button 
                        className="border py-3 px-4 rounded-md"
                        type="button" 
                        disabled={uploading || !file} 
                        onClick={() => pinImageToIPFS(file!)}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                    {/* Add a conditional looking for the signed url and use it as the source */}
                    {url && <img src={url} alt="Image from Pinata" />}
                

            </main>


        </div>
    );

}

export default Data;