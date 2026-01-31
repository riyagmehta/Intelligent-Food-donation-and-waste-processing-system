FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app
COPY . .
RUN chmod +x ./mvnw
RUN ./mvnw clean package -DskipTests

FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 10000
ENTRYPOINT ["java", "-jar", "app.jar"]
```

Changed `EXPOSE 8080` → `EXPOSE 10000`. (You can also see in your original logs that Render was scanning for an open port and Tomcat bound to 10000 — so this aligns them.)

---

Also fix your `.env.production` — it looks like it got concatenated with other content. It should just be:
```
VITE_API_URL=https://donation-system-backend.onrender.com