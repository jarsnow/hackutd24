import { PinataSDK } from "pinata-web3";
import { NextApiRequest, NextApiResponse } from "next";
import fs from 'fs';
import path from 'path';


const pinata = new PinataSDK({
  pinataJwt: process.env.NEXT_PUBLIC_PINATA_JWT!,
  pinataGateway: "example-gateway.mypinata.cloud",
});

async function main() {
  try {
    const file = new File(["hello"], "Testing.txt", { type: "text/plain" });
    const upload = await pinata.upload.file(file);
    console.log(upload);
  } catch (error) {
    console.log(error);
  }
}

export default function formHandler(req: NextApiRequest, res: NextApiResponse){
  console.log("made it here");
  
  if (req.method === 'POST'){

      const { data, filename = 'form-data.csv' } = req.body;

      console.log(data);

      if(!data || data.length === 0) {
          return res.status(400).json({ error: 'No data provided' });
      }

      const headers = Object.keys(data[0]).join(',');
      const rows = data.map((row:any) => 
          Object.values(row)
          .map(value => "${value}")
          .join(','))

      const csvContent = `${headers}\n${rows}`;
      const filePath = path.join(process.cwd(), 'public', filename);

      fs.writeFileSync(filePath, csvContent);

      res.status(200).json({message: 'CSV created successfully!', filePath});

  } else {
      res.status(405).json({error: 'Method Not Allowed'});
  }
}
