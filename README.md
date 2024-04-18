# FeastFinder

## Introduction

![FeastFinder Logo](image.png)

FeastFinder is an innovative recipe discovery and meal planning app designed to transform the culinary experience at home. Tailoring to personal dietary needs, from vegan to non-vegetarian, FeastFinder simplifies meal planning and helps discover new and exciting recipes.

## Table of Contents

- [About The Project](#about-the-project)
- [Features](#features)
- [Leveraging Annoy for Enhanced Recipe Recommendations](#leveraging-annoy-for-enhanced-recipe-recommendations)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Docker Installation](#docker-installation)
  - [Running With Docker Compose](#running-with-docker-compose)
  - [Installation](#installation)
    - [Local Installation](#local-installation)
      - [Backend Installation](#backend-installation)
      - [Frontend Installation](#frontend-installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

## About The Project

FeastFinder offers a seamless approach to meal planning, with features tailored for diverse dietary preferences. Focused on user convenience, recipes are smartly filtered by preparation and cooking times, matching personal taste, and accommodating specified allergies.

## Features

- **Dietary Customization**: Tailor your meal plans to fit dietary preferences like vegan, vegetarian, and non-vegetarian diets.
- **Cuisine Exploration**: Enjoy a rich variety of cuisines and discover recipes that bring global flavors to your kitchen.
- **Ingredient-Based Recommendations**: Get suggestions based on your frequently used ingredients and cooking habits.
- **Allergen Awareness**: Find recipes that are safe for your dietary restrictions and free from specified allergens.
- **Efficient Meal Planning**: Save time with recipes that fit your lifestyle, sorted by prep time, cook time, and total time.
- **Automated Weekly Meal Plans**: Let FeastFinder handle the planning with automated weekly meal suggestions.

## Leveraging Annoy for Enhanced Recipe Recommendations

FeastFinder's recommendation engine is underpinned by Annoy (Approximate Nearest Neighbors Oh Yeah), a high-speed algorithm optimized for high-dimensional spaces. Developed by Spotify, Annoy facilitates swift, approximate nearest neighbor searches, enabling our app to provide real-time, personalized recipe recommendations.Annoy uses a collection of randomized trees to perform these searches. This method is particularly well-suited for large datasets, like our extensive recipe library, as it scales without sacrificing speed or accuracy. The algorithm ensures quick responses, vital for the interactive nature of FeastFinder, and allows our users to experience minimal delay when seeking meal inspiration.
Additionally, Annoy's compact in-memory footprint is ideal for mobile platforms, ensuring that FeastFinder remains responsive and efficient across devices. The open-source community continually refines Annoy, allowing FeastFinder to benefit from collective advancements in the field of machine learning.

To learn more about Annoy, explore the algorithm's capabilities, and understand why it's integral to FeastFinder's recommendation system, visit the [official Annoy GitHub page](https://github.com/spotify/annoy).

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Before starting the installation, ensure you have the following installed on your system:

1. **Git**: Git is required to clone the repository. Install it from [git-scm.com](https://git-scm.com/downloads).
2. **Python** (for local installation): Install Python from [python.org](https://www.python.org/downloads/).
3. **Node.js** (for both installations): Install Node.js from [nodejs.org](https://nodejs.org/).
4. **Docker and Docker Compose** (for Docker installation): Follow the Docker installation instructions provided in the [Docker Installation section](#docker-installation).

### Docker Installation

#### For Windows and Mac:

1. Download Docker Desktop from [Docker Hub](https://hub.docker.com/?overlay=onboarding).
2. Follow the installation guide to install Docker Desktop on your machine.

#### For Linux:

1. Update your package index:

```bash
  sudo apt update && sudo apt upgrade
```

2. Install required packages for Docker:

```bash
  sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

3. Add Docker’s official GPG key:

```bash
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

4. Set up the stable repository and install Docker CE:

```bash
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
  sudo apt update
  sudo apt install docker-ce
```

5. Verify that Docker is installed correctly by running the hello-world image:

```bash
  sudo docker run hello-world
```

6. Docker Compose Installation

1. Download the current stable release of Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```

2. Apply executable permissions to the binary:

```bash
sudo chmod +x /usr/local/bin/docker-compose
```

3. Test the installation:

```bash
docker-compose --version
```

### Running With Docker Compose

Refer to the detailed steps in the specific section [Running With Docker Compose](#) provided in your project documentation to see how to use Docker Compose to run the application.

## Installation

This section provides detailed instructions for setting up FeastFinder both locally and using Docker Compose.

### Local Installation

Follow these steps to set up the application locally on your machine. This involves separate setups for the backend and frontend components.

- [Backend Installation](#backend-installation)
  - [Windows](#windows)
  - [Linux / macOS](#linux-macos)
- [Frontend Installation](#frontend-installation)

  - [Windows](#windows-1)
  - [Linux/macOS](#linux/macOS-1)

- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Troubleshooting](#troubleshooting)

  ### Clone the repository:

  ```bash
    git clone https://github.com/your_username/FeastFinder.git
  ```

  ### Backend Installation

  #### Windows

  1.  1. **Navigate to the backend directory**::

  ```bash
     cd /Matchmaking_system_backend
  ```

  2. **Set up a Python virtual environment**:

  ```cmd
    python -m venv venv .\venv\Scripts\activate
  ```

  3. **Install Python dependencies**:

  ```cmd
    pip install -r requirements.txt
  ```

  4. **Set environment variables**:
     The .env file typically resides in the root directory of your project where it can be easily accessed by your application during runtime. Here’s how you can set it up and use it:

     1. Create a `.env` File: In the root of your Flask project, create a new file named `.env`.
     1. Populate the `.env` File: Here’s an example of what you should include in a .`env` file for a Flask application:

     ```bash
       SECRET_KEY = your_very_secret_key_here
       DATABASE_URL = 'sqlite:///data/mydatabase.db'
     ```

  #### Linux / macOS

  1. **Navigate to the backend directory**:

  ```bash
   cd /Matchmaking_system_backend
  ```

  2. **Set up a Python virtual environment**:

  ```bash
    python3 -m venv venv source venv/bin/activate
  ```

  3. **Install Python dependencies**:

  ```bash
     pip install -r requirements.txt
  ```

  ### Frontend Installation

  #### Setting Up Environment Variables

  1. **Create a `.env` File**: In the root of your frontend directory (where your `package.json` file is located), create a new file named `.env`.

  2. **Configure API URL**:

  - Open the `.env` file and add the following line:

    ```plaintext
    VITE_BACKEND_BASE_API_URL=http://127.0.0.1:5000
    ```

  - This variable sets the base URL for your API requests to the backend. Adjust the URL if your backend server is running on a different address or port.

  #### Windows

  1. **Navigate to the frontend directory**:

  ```cmd
  cd /Matchmaking_system_backend
  ```

  2. **Install JavaScript dependencies**:

  ```cmd
    npm install
  ```

  #### Linux / macOS

  1. **Navigate to the frontend directory**:

  ```bash
    cd /Matchmaking_system_backend
  ```

  2. **Install JavaScript dependencies**:

     ```bash
       npm install
     ```

  ### Running the Application

  1. **Start the Flask backend**:

     ```bash
     cd /Matchmaking_system_backend
     flask run
     ```

  2. **In a new terminal, start the frontend**:

     ```bash
      npm start
     ```

### Usage

- **Accessing the App**: Open your web browser and visit `http://localhost:3000` to see the application running.

### Troubleshooting

- **Dependency issues**: Ensure all dependencies are correctly installed, and the virtual environment is activated when running Flask.
- **Environment Variables**: Confirm that all required environment variables are set in `.env` or your OS.

This guide includes specific steps for setting up the backend and frontend components of the FeastFinder application on Windows, Linux, and macOS systems. Adjust the file paths, command syntax (bash vs. cmd), and environment variables according to your specific project setup and requirements.
