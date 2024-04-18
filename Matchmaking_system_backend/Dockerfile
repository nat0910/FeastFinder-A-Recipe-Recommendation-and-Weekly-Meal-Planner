# Use an official Python runtime as a parent image
FROM python:3.10-slim

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install system dependencies
RUN apt-get update && apt-get install -y --fix-missing \
    build-essential \
    libgfortran5 \
    && rm -rf /var/lib/apt/lists/*

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data
RUN python -m nltk.downloader punkt stopwords wordnet

RUN mkdir -p /app/instance/data /app/logs
# Make port 5000 available to the world outside this container
EXPOSE 5000

# Define environment variable
ENV FLASK_ENV=production

# Run app.py when the container launches
CMD ["flask", "run", "--host=0.0.0.0"]


# Use an official Python runtime as the parent image
# FROM python:3.10-slim

# # Set environment variables:
# # Prevents Python from writing pyc files to disc (equivalent to `python -B` option)
# ENV PYTHONDONTWRITEBYTECODE 1
# # Prevents Python from buffering stdout and stderr (equivalent to `python -u` option)
# ENV PYTHONUNBUFFERED 1

# # Set the working directory in the container to /app
# WORKDIR /app

# # Install system dependencies (if you have any, otherwise this can be omitted)
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     build-essential \
#     libsqlite3-mod-spatialite \
#  && rm -rf /var/lib/apt/lists/*

# # Copy the Python dependencies file to the container at /app
# COPY requirements.txt /app/

# # Install any needed packages specified in requirements.txt
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy the current directory contents into the container at /app
# COPY . /app

# RUN python -m nltk.downloader punkt stopwords wordnet

# # Make sure the SQLite database and logs directory exist
# RUN mkdir -p /app/instance/data /app/logs


# # Run the application with Gunicorn
# CMD ["gunicorn", "--workers", "3", "--bind", "0.0.0.0:5000", "run:app"]
