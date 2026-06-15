# Build stage
FROM maven:3.9.6-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Run stage
FROM eclipse-temurin:17-jre AS run
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
EXPOSE 2007
ENTRYPOINT ["java", "-jar", "app.jar", "--server.port=${PORT:2007}"]
