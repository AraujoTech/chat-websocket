#!/bin/bash

# This script is used to start the application
cd /usr/app
pm2 start /usr/app/bin/www -n www -f