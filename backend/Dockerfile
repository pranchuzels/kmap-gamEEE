FROM python:3.12-slim-bullseye

# Install Verilog simulators
RUN apt-get update && \
    apt-get install -y iverilog verilator && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

COPY . /app/server
WORKDIR /app/server

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
