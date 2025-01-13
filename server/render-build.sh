#!/usr/bin/env bash

# Debug: Log script execution
echo "Starting render-build.sh"

# Install Java (if missing)
if [ ! -d "/opt/java/openjdk" ]; then
  echo "Installing Java..."
  curl -o /tmp/openjdk.tar.gz https://download.java.net/java/GA/jdk17/0d1cfde4252546c6931946de8db48ee2/36/GPL/openjdk-17_linux-x64_bin.tar.gz
  mkdir -p /opt/java/openjdk
  tar -xzf /tmp/openjdk.tar.gz -C /opt/java/openjdk --strip-components=1
else
  echo "Java already installed at /opt/java/openjdk"
fi

# Set up Java environment variables
export JAVA_HOME=/opt/java/openjdk
export PATH=$JAVA_HOME/bin:$PATH

# Debug: Check Java installation
echo "JAVA_HOME is set to $JAVA_HOME"
java -version || echo "Java not found"

# Build the Maven project
./mvnw clean package