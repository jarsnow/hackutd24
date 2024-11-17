import pandas as pd
from pandasql import sqldf
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
        print("res:")
        print(home_info_res)

        print("home info:")
        state_name = home_info_res['state_name'][0]
        house_type = home_info_res['TYPEHUQ'][0]
        print(f"state_name: {state_name}")
        print(f"house_type: {house_type}")

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

        # make folder for plots to go in
        os.mkdir("./info")
        os.mkdir("./info/plots")
        os.mkdir("./info/data")

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
        # Function to upload all files in a folder
        folder_path = Path("./info")
        
        # Check if folder exists
        if not folder_path.is_dir():
            raise ValueError(f"{folder_path} is not a valid directory")
        
        upload_folder("./info")


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
    
    response = requests.post(PINATA_API_URL, headers=headers, files=files)
    
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
    main()