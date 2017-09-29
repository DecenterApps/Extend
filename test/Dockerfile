FROM ubuntu:14.04
MAINTAINER Decenter "nklipa@decenter.com"

RUN apt-get update && apt-get -y install python-minimal && apt-get -y install python-pip
RUN pip install requests

CMD /usr/bin/python -c "import requests; import os; import json; url=\"http://oauth.reddit.com/api/v1/me\"; token=os.environ['ARG0']; authKey = \"bearer \"+token; headers={'authorization': authKey}; response = requests.request(\"POST\", url, data=\"\", headers=headers); print(json.loads(response.text)[\"name\"]) if response.status_code == 200 else response.status_code"
