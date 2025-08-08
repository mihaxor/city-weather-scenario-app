# City Weather Scenario App

A React TypeScript application that displays weather information for cities with a scenario-based user experience.
The application is using SQLite for local data storage and integrates with the OpenWeatherMap API to fetch weather data.

## Prerequisites

- Node.js (v22.18.0) - use `nvm use` to switch to the correct version
- Yarn package manager

## Setup and Installation

### 1. Set up API Key

Create a `.env` file in the root directory with the following environment variables:

```env
# Server Configuration
EXPRESS_SERVER_WEATHER_API=https://api.openweathermap.org/data/3.0
EXPRESS_SERVER_WEATHER_API_KEY=your_openweathermap_api_key_here
EXPRESS_SERVER_PORT=8080

# Client Configuration
VITE_APP_API_BASE_URL=http://localhost:8080/api
```

**To get an OpenWeatherMap API key:**
1. Go to [OpenWeatherMap](https://openweathermap.org/)
2. Sign up for a free account
3. Navigate to "My API Keys" section
4. Copy your API key and paste it in the `.env` file

### 2. Install Dependencies

```bash
nvm use
yarn install
```

### 3. Build the Application

```bash
yarn run build
```

### 4. Start the Server

```bash
yarn run server
```

The application will be available at `http://localhost:8080`

## Application Scenario

The client has a simple scenario

REST countries API (https://restcountries.eu/#api-endpoints-all ) returns detailed country information

OpenWeatherMap REST API (https://openweathermap.org ) returns detailed weather information for a particular city

The client needs a new REST API and React front-end which will:

Support CRUD operations for a city
Combine weather and country data for a particular city when searching


API
Create a Node/Express REST API that supports the following operations

Add City - adds city name, state (i.e. geographic sub-region), country, tourist rating (1-5), date established and estimated population. Adds record to local SQL data store and generates unique city id.

Update city – update rating, date established and estimated population by city id

Delete city – delete city by city id

Search city – search by city name, and returns the city id, name, state (i.e. geographic sub-region), country, tourist rating (1-5), date established, estimated population, 2 digit country code, 3 digit country code, currency code and weather for the city. If there are multiple matches, this information is returned for all matches. If the city is not stored locally no results need be returned. The APIs above should be used to provide any information not stored locally.

The Add, Update and Delete operations will take place against a local SQL data store

Provide at least 1 unit test

UI
Create a React front-end to enable searching and CRUD operations


There’s only 1 explicit non-functional requirement:


Structure your code using modern development practices, the type you’d be proud to see in production