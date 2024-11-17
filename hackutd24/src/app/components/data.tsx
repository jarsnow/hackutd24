"use client";
import React from 'react';
import { useState } from 'react';
import { useVisibilityContext } from "./visibilitycontext";

const Data: React.FC = () =>{
    const { isDataVisible } = useVisibilityContext();

    const [file, setFile] = useState<File>();
    const [url, setUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    const uploadFile = async () => {
        try {
            if (!file) {
                alert("No file selected");
                return;
            }
            setUploading(true);
            const data = new FormData();
            data.set("file", file);
            const uploadRequest = await fetch("/api/files", {
                method: "POST",
                body: data,
            });
            const signedUrl = await uploadRequest.json();
            setUrl(signedUrl);
            setUploading(false);
        } catch (e) {
            console.log(e);
            setUploading(false);
            alert("Trouble uploading file");
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFile(e.target?.files?.[0]);
    };
    
    console.log("isDataVisible:", isDataVisible);
    return (

        <div className={`${isDataVisible ? "block" : "hidden"}flex-1 bg-gray-100 p-4`}>

                <p className="text-2xl font-bold">Data Here</p>
                <main className="w-full min-h-screen m-auto flex flex-col justify-center items-center">
                    <input type="file" onChange={handleChange} />
                    <button type="button" disabled={uploading} onClick={uploadFile}>
                        {uploading ? "Uploading..." : "Upload"}
                    </button>
                    {/* Add a conditional looking for the signed url and use it as the source */}
                    {url && <img src={url} alt="Image from Pinata" />}
                

            </main>





        </div>
    );

}

export default Data;