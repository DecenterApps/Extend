FROM ubuntu:14.04
MAINTAINER Decenter "extend@decenter.com"

ADD send_request.py /

RUN apt-get update && apt-get -y install python-minimal && apt-get -y install python-pip
RUN pip install requests

CMD [ "python", "./send_request.py" ]