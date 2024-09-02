#!/bin/sh

MIGRATION_FILE=$1
PROVIDED_DB=$2

DB_PATH=${PROVIDED_DB:=db.sqlite}

cat $MIGRATION_FILE | sqlite3 db.sqlite -interactive

