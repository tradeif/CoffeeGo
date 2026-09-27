# ====================================================================
# Build Stage: Build the Spring Boot application using Maven & Java 21
# ====================================================================
FROM maven:3.9-eclipse-temurin-21 AS builder

WORKDIR /build

# Copy pom.xml first to take advantage of Docker layer caching for dependencies
COPY pom.xml .
RUN mvn dependency:go-offline -B || true

# Copy application source code
COPY src ./src

# Package application (skipping unit tests during container build)
RUN mvn clean package -DskipTests

# ====================================================================
# Runtime Stage: Minimal JRE 21 image for running the application
# ====================================================================
FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

# Create a non-privileged user and group for enhanced security
RUN groupadd -g 1001 appgroup && \
    useradd -u 1001 -g appgroup -s /bin/bash -m appuser

# Copy the built jar from the builder stage
COPY --from=builder --chown=appuser:appgroup /build/target/coffeego-*.jar app.jar

# Switch to non-root user
USER appuser

# Expose default application port
EXPOSE 8080

# Configure JVM memory and garbage collection options for container environments
ENV JAVA_OPTS="-XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -Djava.security.egd=file:/dev/./urandom"

# Healthcheck to verify Spring Boot service responsiveness
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Launch the Spring Boot application
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
