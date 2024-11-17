

export const callPythonScript = async () => {
  try {
    
    const response = await fetch('../../api/pythonapi/route.tsx', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        scriptPath: '/Users/andrewhuang/Desktop/Projects and Fun/Programming/Hackathon/hackutd-2024/hackutd24/hackutd24/tools/data_processing.py',  // The full path to the script on your server
        args: ['arg1', 'arg2'], 
      }),
    });

   
    if (!response.ok) {
      throw new Error(`Failed to call API: ${response.statusText}`);
    }

 
    const data = await response.json();
    console.log('Python script output:', data.output);
  } catch (error) {
    
  }
};

export default callPythonScript;
