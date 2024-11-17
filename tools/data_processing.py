import os
import requests
from dotenv import load_dotenv

load_dotenv('.env.local')
# Load your PINATA_JWT from environment variable
pinata_jwt = os.getenv('PINATA_JWT')

# Ensure that the PINATA_JWT is set
if not pinata_jwt:
    raise ValueError("PINATA_JWT environment variable is not set.")

# The CID of the file you want to retrieve from Pinata
cid = "QmRRv7GTpsYvHeLR5xkvcBr4BvCPD7qNrgVNcQJRMAdEXk"

# Pinata API URL for the file
url = f"https://api.pinata.cloud/data/pinList?hashContains={cid}"

# Headers for the request, including the Bearer token
headers = {
    'Authorization': f'Bearer {pinata_jwt}'
}

file_url = f"https://gateway.pinata.cloud/ipfs/{cid}"
response = requests.get(file_url)

if response.status_code == 200:
    with open("file_from_pinata.csv", "wb") as f:
        f.write(response.content)
    print("File downloaded successfully.")
else:
    print(f"Error downloading the file: {response.status_code}")
