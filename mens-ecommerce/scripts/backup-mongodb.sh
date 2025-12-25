#!/bin/bash

# MongoDB Backup Script
# Usage: ./backup-mongodb.sh

set -e

# Configuration
BACKUP_DIR="./backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="backup-$TIMESTAMP"
RETENTION_DAYS=7

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Default values
MONGO_HOST=${MONGO_HOST:-localhost}
MONGO_PORT=${MONGO_PORT:-27017}
MONGO_USER=${MONGO_ROOT_USER:-admin}
MONGO_PASSWORD=${MONGO_ROOT_PASSWORD:-password123}
MONGO_DB=${MONGO_DB_NAME:-topia_ecommerce}

echo "================================"
echo "MongoDB Backup Script"
echo "================================"
echo "Timestamp: $TIMESTAMP"
echo "Database: $MONGO_DB"
echo "Host: $MONGO_HOST:$MONGO_PORT"
echo "================================"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Run mongodump
echo "Starting backup..."
mongodump \
    --host="$MONGO_HOST" \
    --port="$MONGO_PORT" \
    --username="$MONGO_USER" \
    --password="$MONGO_PASSWORD" \
    --authenticationDatabase=admin \
    --db="$MONGO_DB" \
    --out="$BACKUP_DIR/$BACKUP_NAME"

if [ $? -eq 0 ]; then
    echo "✅ Backup completed successfully!"
    echo "Location: $BACKUP_DIR/$BACKUP_NAME"
    
    # Compress backup
    echo "Compressing backup..."
    tar -czf "$BACKUP_DIR/$BACKUP_NAME.tar.gz" -C "$BACKUP_DIR" "$BACKUP_NAME"
    rm -rf "$BACKUP_DIR/$BACKUP_NAME"
    echo "✅ Backup compressed: $BACKUP_DIR/$BACKUP_NAME.tar.gz"
else
    echo "❌ Backup failed!"
    exit 1
fi

# Remove old backups
echo "Cleaning up old backups (older than $RETENTION_DAYS days)..."
find "$BACKUP_DIR" -name "backup-*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
echo "✅ Cleanup completed!"

echo "================================"
echo "Backup process finished!"
echo "================================"
