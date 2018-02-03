#!/bin/bash
# Usage: create_random.sh <num brackets>
# Creates a random entry with the specified number of brackets and puts to ipfs.
# Outputs IPFS hash. Must have ipfs installed and daemon running. See https://ipfs.io

num_brackets=$1
cat /dev/urandom | head -c $(( num_brackets * 8 ))
