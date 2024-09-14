#!/bin/bash

# Default values
ENV_FILE=".env"
PRIVATE_KEY="private-key"
PUBLIC_KEY="public-key"

# Function to prompt for input with a default value
prompt() {
  local prompt_message=$1
  local default_value=$2
  read -p "$prompt_message (Default: $default_value):" input
  echo "${input:-$default_value}"
}

# Get the .env file location
ENV_FILE=$(prompt "Enter the env file location" "$ENV_FILE")

# Check if the env file exists
if [ ! -f "$ENV_FILE" ]; then
  echo "Env file not found: $ENV_FILE"
  exit 1
fi

echo "Env file found: $ENV_FILE"

# Get private and public key file locations
PRIVATE_KEY=$(prompt "Enter the private key file location" "$PRIVATE_KEY")
PUBLIC_KEY=$(prompt "Enter the public key file location" "$PUBLIC_KEY")

# Function to append base64 encoded key to the .env file with double quotes
add_key_to_env() {
  local key_file=$1
  local env_key_name=$2

  if [ -f "$key_file.pem" ]; then
    encoded_key=$(base64 -i "$key_file.pem" | tr -d '\n')
    echo "$env_key_name=\"$encoded_key\"" >>"$ENV_FILE"
  else
    echo "Key file not found: $key_file.pem"
    exit 1
  fi
}

# Add private and public keys to the .env file
add_key_to_env "$PRIVATE_KEY" "JWT_PRIVATE_KEY"
add_key_to_env "$PUBLIC_KEY" "JWT_PUBLIC_KEY"

echo "Keys have been successfully added to $ENV_FILE"
