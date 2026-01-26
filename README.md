# Intelligent Food Donation and Waste Processing System

A full-stack web application designed to streamline food donation management by connecting donors, collection centers, and staff. The system helps minimize food waste through efficient tracking, real-time status updates, and intelligent resource allocation.

## Overview

This platform enables:
- Donors to create and track food donation requests
- Collection centers to manage incoming donations and inventory
- Staff to process donations and coordinate deliveries
- Administrators to monitor system-wide operations and analytics
- AI-powered features for smart descriptions, food handling tips, and personalized thank you messages

## Technology Stack

### Backend
- Spring Boot 3.x
- Java 17
- PostgreSQL
- Spring Security (JWT Authentication)
- Spring Data JPA
- Google Gemini AI API
- Maven

### Frontend
- React 18
- Chakra UI
- React Router
- Axios
- Vite

## Prerequisites

- Java JDK 17 or higher
- Maven 3.6+
- Node.js 16+
- PostgreSQL 12+

## Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/riyagmehta/Intelligent-Food-donation-and-waste-processing-system.git
cd Intelligent-Food-donation-and-waste-processing-system
```

### 2. Database Configuration

Create a PostgreSQL database:
```bash
createdb donationdb
```

Update `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/donationdb
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update

# Google Gemini AI API Configuration
gemini.api.key=your_gemini_api_key_here
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent
```

> Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 3. Install Dependencies

**Backend:**
```bash
mvn clean install
```

**Frontend:**
```bash
cd frontend
npm install
```

## Running the Application

### Start Backend Server
```bash
mvn spring-boot:run
```

Backend runs on `http://localhost:8080`

### Start Frontend Development Server
```bash
cd frontend
npm run dev
```

Frontend runs on `http://localhost:3000`

## Live Demo

**Deployment Link:** Coming soon



