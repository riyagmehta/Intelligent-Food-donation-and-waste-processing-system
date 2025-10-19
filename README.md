# 🥗 Intelligent Food Donation and Waste Processing System

A fullstack application built with **Spring Boot** and **React** to manage food donations, collection centers, deliveries, and waste processing efficiently.
It connects **donors**, **collection centers**, and **logistics teams** to minimize food waste and ensure proper resource utilization.

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/riyagmehta/Intelligent-Food-donation-and-waste-processing-system.git
cd Intelligent-Food-donation-and-waste-processing-system
```

### 2️⃣ Configure PostgreSQL

Open `src/main/resources/application.properties` and set your PostgreSQL credentials:

```
spring.datasource.url=jdbc:postgresql://localhost:5432/donationdb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

### 3️⃣ Install Dependencies

```bash
mvn clean install
```

### 4️⃣ Run the Application

```bash
mvn spring-boot:run
```

The backend will start on:
👉 `http://localhost:8080`

---



## 🛠️ Tech Stack

* **Spring Boot (Java 17)**
* **PostgreSQL**
* **Spring Data JPA**
* **Lombok**
* **Spring Web**
* **Maven**

---

## 👩‍💻 Author

**Riya Mehta**
University of Illinois Chicago
