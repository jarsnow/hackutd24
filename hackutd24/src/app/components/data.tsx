"use client";

import React from 'react';
import { useState } from 'react';
import { useVisibilityContext } from "./visibilitycontext";

const Data: React.FC = () =>{
    const { isDataVisible } = useVisibilityContext();

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        state_name: '',
        TYPEHUQ: '',
        KWH: '',
        KWHWTH: '',
        KWHLGT: '',
        KWHSPH: '',
        KWHCOL: '',
        KWHRFG: ''
    });


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
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }))
    };

    const handleFormSubmission = async (e: React.FormEvent) => {
        setFormLoading(true);

        e.preventDefault();

        const response = await fetch('/api/files/formroute', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({data: [formData]})
        });

        if (response.ok){
            const result = await response.json();
            console.log('CSV file created at: ', result.filePath);
        } else {
            console.error('Error in creating CSV file');
        }


        setFormLoading(false);
    };
    
    return (

        <div className={`${isDataVisible ? "block" : "hidden"}
            flex-1 bg-dark w-full min-h-screen flex flex-col overscroll-none`}>
            
            <div className="overscroll-none overflow-x-hidden bg-lighter-dark sticky top-0 shadow-md w-full p-4 content-center overflow-y-hidden">
                <p className="w-full text-2xl font-bold text-center text-white">Insert Data:</p>
            </div>
            
            <main className="my-5 w-full min-h-screen m-auto flex flex-col items-center overflow-y-auto space-y-8">
                    <input className="w-full max-w-xs text-center border border-white rounded-md p-2" type="file" onChange={handleChange} />

                    {/* form here? */}
                    <form onSubmit={handleFormSubmission}>
                        {Object.keys(formData).map((key) => (
                            <div key={key}>
                                <label>{key.replace(/([A-Z])/, ' $1')}</label>
                                <input 
                                    className="text-black rounded-md"
                                    type="text"
                                    name={key}
                                    value={formData[key as keyof typeof formData ]}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        ))}
                        <button 
                        type="submit">
                            Submit
                        </button>
                    </form>


                    <button 
                        className="border py-3 px-4 rounded-md "
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