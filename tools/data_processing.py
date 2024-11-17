import pandas as pd
from pandasql import sqldf
from groq import Groq
import numpy
import os
import requests
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import shutil
from pathlib import Path
import time


def main(user_file_CID):

    temporary_file_path = "./file_from_pinata.csv"
    tools_file_path = "../tools/"

    # ensure CID is present
    if not user_file_CID:
        print("no CID found, input it better")
        return

    load_dotenv('.env.local')
    # Load your PINATA_JWT from environment variable
    global pinata_jwt
    pinata_jwt = os.getenv('PINATA_JWT')

    # Ensure that the PINATA_JWT is set
    if not pinata_jwt:
        raise ValueError("PINATA_JWT environment variable is not set.")

    # Pinata API URL for the file
    pinata_api_url = f"https://api.pinata.cloud/data/pinList?hashContains={user_file_CID}"

    # Headers for the request, including the Bearer token
    headers = {
        'Authorization': f'Bearer {pinata_jwt}'
    }

    file_url = f"https://gateway.pinata.cloud/ipfs/{user_file_CID}"
    response = requests.get(file_url)

    if response.status_code == 200:
        # write and save file
        with open(temporary_file_path, "wb") as f:
            f.write(response.content)

        # open as pandas dataframe
        user_dataframe = pd.read_csv(temporary_file_path)
        os.remove(temporary_file_path)

        # query user dataframe to get information about their house
        get_home_info_query = "SELECT * FROM user_dataframe;"
        home_info_res = sqldf(get_home_info_query, locals())

        state_name = home_info_res['state_name'][0]
        house_type = home_info_res['TYPEHUQ'][0]

        big_dataframe = pd.read_csv(tools_file_path + "recs2020_public_v7.csv")
        
        get_similar_house_data_query = f"SELECT KWH, KWHWTH, KWHLGT, KWHSPH, KWHCOL, KWHRFG FROM big_dataframe\
                          WHERE STATE_FIPS = {state_name}\
                          AND TYPEHUQ = {house_type}\
                            LIMIT 20;"
        
        similar_house_data_results = sqldf(get_similar_house_data_query, locals())

        similar_house_data_results = similar_house_data_results / 12.0

        print(similar_house_data_results.median()['KWH'])
        col_names = ['KWH', 'KWHWTH', 'KWHLGT', 'KWHSPH', 'KWHCOL', 'KWHRFG']
        # 0th row is median
        # 1st row is mean
        fig, ax = plt.subplots()

        try:
            # remove info and other files
            dir_path = "./info"
            for filename in os.listdir(dir_path):
                filepath = os.path.join(dir_path, filename)
                try:
                    if os.path.isfile(filepath):
                        os.remove(filepath)
                    elif os.path.isdir(filepath):
                        shutil.rmtree(filepath)
                except OSError as e:
                    print(f"Error deleting {filepath}: {e}")

            os.rmdir("./info")
            os.remove("./llama_response.txt")
        except Exception:
            print("no llama or info txt file")
        

        # make folder for plots to go in
        os.mkdir("./info")
        os.mkdir("./info/plots")
        os.mkdir("./info/data")

        code_to_title = {
            "KWH":"Total Monthly Electricity Usage",
            "KWHWTH":"Monthly Water Heating Usage",
            "KWHLGT":"Monthly Lighting Usage",
            "KWHSPH":"Monthly Heating Usage",
            "KWHCOL":"Monthly Cooling Usage",
            "KWHRFG":"Monthly Refridgeration Usage"
        }

        # use two headers
        # I apologize for this ugly nested code
        with open("user_data.csv", "w") as user_data_file:
            with open("output_houses_data.csv", "w") as similar_houses_file:

                # write headers
                user_data_file.write("KWH,KWHWTH,KWHLGT,KWHSPH,KWHCOL,KWHRFG\n")
                similar_houses_file.write("KWH,KWHWTH,KWHLGT,KWHSPH,KWHCOL,KWHRFG\n")

                for i, category in enumerate(col_names):

                    # write user data
                    # omit the last comma if it is the last one
                    user_data_file.write(f"{str(home_info_res[category][0])}" + "," if i != len(col_names) - 1 else "")
                    similar_houses_file.write(f"{str(similar_house_data_results[category][0])}" + "," if i != len(col_names) - 1 else "")

                    # Create the plot
                    ax.boxplot(similar_house_data_results[category], vert=False)

                    # add line of the user's value
                    ax.axvline(x=home_info_res[category][0], color='red', linestyle='--')
                    ax.yaxis.set_visible(False)

                    plt.title(code_to_title[category])

                    plt.xlabel("Energy Usage (kWh)")

                    fig.set_figheight(3)

                    # save the plot
                    plt.savefig(f'{category}.png', bbox_inches='tight')
                    # move to folder
                    shutil.move(f'{category}.png', f'./info/plots/{category}.png')

                    ax.clear()

        # move everything into info
        shutil.move("user_data.csv", "./info/data/user_data.csv")
        shutil.move("output_houses_data.csv", "./info/data/output_houses_data.csv")

        # put info on pinata
        folder_path = Path("./info")
        
        # check if folder exists
        if not folder_path.is_dir():
            raise ValueError(f"{folder_path} is not a valid directory")
        
        upload_folder("./info")

        # get cool ai response
        client = Groq(
            api_key=os.getenv("GROQ_API_KEY"),
        )

        # create prompt
        prompt = f"""You must give advice on how users can reduce their electricity usage
        compared to others in the same household.
        The following information contains the monthly electricity usage in kilo-watt hours for multiple categories:
        User's Total Electricity Usage: {str(home_info_res['KWH'][0])} Median Total Electricity Usage: {str(similar_house_data_results['KWH'][0])}
        User's Water Heating Usage: {str(home_info_res['KWHWTH'][0])} Median Water Heating Usage: {str(similar_house_data_results['KWHWTH'][0])}
        User's Lighting Usage: {str(home_info_res['KWHLGT'][0])} Median Lighting Usage: {str(similar_house_data_results['KWHLGT'][0])}
        User's Heating Usage: {str(home_info_res['KWHSPH'][0])} Median Heating Usage: {str(similar_house_data_results['KWHSPH'][0])}
        User's Cooling Usage: {str(home_info_res['KWHCOL'][0])} Median Cooling Usage: {str(similar_house_data_results['KWHCOL'][0])}
        User's Refridgeration Usage: {str(home_info_res['KWHRFG'][0])} Median Refridgeration Usage: {str(similar_house_data_results['KWHRFG'][0])}
        If the category is below the median, ignore it. Focus on giving tips for categories for which the user's usage is greater than the median amount.
        """

        # feed prompt to llama3
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "user",
                    "content": prompt,
                }
            ],
            model="llama3-8b-8192",
        )

        # save output to file
        with open("llama_response.txt", "w") as llama_response_file:
            llama_response_file.write(chat_completion.choices[0].message.content)

        # upload file to pinata
        upload_file("./llama_response.txt")

    else:
        print(f"Error downloading the file: {response.status_code}")

def upload_folder(folder_path):
    """Uploads all files in a folder to Pinata."""
    folder_path = Path(folder_path)
    
    # Check if folder exists
    if not folder_path.is_dir():
        raise ValueError(f"{folder_path} is not a valid directory")
    
    # Loop through all files in the directory
    for file in folder_path.rglob('*'):
        if file.is_file():  # Skip directories
            print(f"Uploading file: {file}")
            try:
                upload_file_with_retries(file)
            except Exception as e:
                print(f"Failed to upload {file}: {e}")

# Function to upload a single file
def upload_file(file_path):
    """Uploads a single file to Pinata."""
    headers = {
        'Authorization': f'Bearer {pinata_jwt}',
    }
    files = {
        'file': open(file_path, 'rb'),
    }
    
    response = requests.post('https://api.pinata.cloud/pinning/pinFileToIPFS', headers=headers, files=files)
    
    if response.status_code == 200:
        data = response.json()
        print(f"File uploaded successfully: {file_path}")
        print(f"CID: {data['IpfsHash']}")
        return data
    else:
        raise Exception(f"Failed to upload file: {response.text}")

# Helper function to handle retries
def upload_file_with_retries(file_path, retries=3, delay=5):
    """Attempts to upload a file with retries in case of failure."""
    for attempt in range(retries):
        try:
            return upload_file(file_path)
        except requests.exceptions.RequestException as e:
            print(f"Error uploading {file_path}: {e}")
            if attempt < retries - 1:
                print(f"Retrying in {delay} seconds...")
                time.sleep(delay)
            else:
                raise

if __name__ == "__main__":
    main("Qma8VQyCPqtmsT12x69C323QhT9SGMwtJTbAmGoYr3P4Us")
