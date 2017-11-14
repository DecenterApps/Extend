import requests; 
import os; 
import json; 

url = "http://oauth.reddit.com/api/v1/me"; 
token = os.environ['ARG0']; 
authKey = "bearer " + token; 

headers = {'authorization': authKey, 'User-Agent': 'extend.ethereum.agent.v0'};
response = requests.request("POST", url, data = "", headers = headers);

print(json.loads(response.text)["name"]) if response.status_code == 200 else "er"