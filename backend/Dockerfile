# Step 1: Use an official OpenJDK image as a base
FROM openjdk:17-jdk-alpine

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy the Spring Boot JAR file to the container
COPY target/*.jar app.jar

# Step 4: Expose the port your app will run on (typically 8080)
EXPOSE 8080

# Step 5: Set the default command to run the JAR file
ENTRYPOINT ["java", "-jar", "app.jar"]
