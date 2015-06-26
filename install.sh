#!/bin/bash

HOST="127.0.0.1"
PORT="8888"

#export JAVA_HOME="/usr/java/jdk1.7.0_76" && ~/opt/apache-maven-3.3.3/bin/mvn install
export JAVA_HOME="/usr/java/jdk1.7.0_76" && ~/opt/apache-maven-3.3.3/bin/mvn -P autoInstallBundle clean install -Dsling.url=http://${HOST}:${PORT}/system/console
