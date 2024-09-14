#!/bin/bash

printf "Generating RSA 256-bit Public Key\n\n"

PRIVATE_KEY_FILE=private-key

read -p "Enter the name of the private key file [Default: private-key.pem]:" ALTER_PRIVATE_KEY_FILE

if [ ! -z "$ALTER_PRIVATE_KEY_FILE" ]; then
  PRIVATE_KEY_FILE=$ALTER_PRIVATE_KEY_FILE
fi

PUBLIC_KEY_FILE=public-key

read -p "Enter the name of the public key file [Default: public-key.pem]: " ALTER_PUBLIC_KEY_FILE

if [ ! -z "$ALTER_PUBLIC_KEY_FILE" ]; then
  PUBLIC_KEY_FILE=$ALTER_PUBLIC_KEY_FILE
fi

openssl rsa -pubout -in "$PRIVATE_KEY_FILE".pem -out "$PUBLIC_KEY_FILE".pem

echo Public key file generated: "$PUBLIC_KEY_FILE".pem
