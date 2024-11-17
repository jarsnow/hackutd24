import { NextApiRequest, NextApiResponse } from 'next';
import { spawn } from 'child_process';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Ensure the method is POST
  if (req.method === 'POST') {
    const pythonProcess = spawn('python', ['./path/to/your-script.py', 'arg1', 'arg2']);

    pythonProcess.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        res.status(200).json({ message: 'Python script executed successfully' });
      } else {
        res.status(500).json({ message: 'Error executing Python script' });
      }
    });
  } else {
    // Respond with 405 Method Not Allowed if not POST
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
