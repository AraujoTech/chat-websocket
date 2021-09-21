#!/bin/bash

# This script is used to stop application
cd cd /usr/app
pm2 stop www || true