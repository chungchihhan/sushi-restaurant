#!/bin/bash

# Check if correct number of arguments are passed
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 SOURCE_DB_URI TARGET_DB_URI"
    exit 1
fi

SOURCE_DB_URI=$1
TARGET_DB_URI=$2
BACKUP_PATH="./backup"

# Function to clean up backup directory
cleanup() {
    echo "Cleaning up backup directory..."
    rm -rf "$BACKUP_PATH"
}

trap cleanup EXIT

mkdir -p "$BACKUP_PATH"

# Export data
echo "Starting data export..."
docker run --rm -v "$BACKUP_PATH":/backup mongo mongodump --uri="$SOURCE_DB_URI" --out=/backup/

# Check if export was successful
if [ $? -ne 0 ]; then
    echo "Data export failed."
    exit 1
fi

# Import data
echo "Starting data import to the new database..."
docker run --rm -v "$BACKUP_PATH":/backup mongo mongorestore --uri="$TARGET_DB_URI" $BACKUP_PATH

# Check if import was successful
if [ $? -ne 0 ]; then
    echo "Data import failed."
    exit 1
fi

echo "Migration completed successfully."
# Cleanup will be called here, after script execution or exit
