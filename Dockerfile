FROM eclipse-temurin:25-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw
RUN ./mvnw package -DskipTests

EXPOSE 8080

CMD ["java", "-jar", "target/exp9-0.0.1-SNAPSHOT.jar"]