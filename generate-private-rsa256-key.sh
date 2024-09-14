#!/bin/bash

printf "Generating RSA 256 private key...\n\n"

PRIVATE_KEY_FILE="private-key"

read -p "Enter the private key file name [Default: private-key.pem]:" ALTER_PRIVATE_KEY_FILE

if [ ! -z "$ALTER_PRIVATE_KEY_FILE" ]; then
  PRIVATE_KEY_FILE=$ALTER_PRIVATE_KEY_FILE
fi

openssl genpkey -algorithm RSA -out "$PRIVATE_KEY_FILE".pem -pkeyopt rsa_keygen_bits:2048

echo "Private key file generated: $PRIVATE_KEY_FILE".pem
