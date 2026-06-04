#!/bin/bash
OPENSSL_CONF=/tmp/legacy-openssl.cnf curl -v -k --tlsv1.0 -L \
  -c /tmp/usv-cookies.txt -b /tmp/usv-cookies.txt \
  -d "userid=gabriel.robu@student.usv.ro&pwd=Student331788&timezoneOffset=-120" \
  "https://scolaritate.usv.ro/psp/PT90SYS/?cmd=login&languageCd=ROM" 2>&1 | \
  grep -E "< |Location|title|menu|error|invalid|PS_"
