FROM python:3.9-slim

WORKDIR /bedford
COPY src/main/ ./
RUN pip3 install -r requirements.txt

ENV PYTHONPATH "/bedford:${PYTHONPATH}"
CMD python3 service.py