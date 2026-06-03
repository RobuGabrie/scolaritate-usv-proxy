#!/bin/sh
set -e

printf '%s\n%s\n' "$VPN_USERNAME" "$VPN_PASSWORD" > /tmp/auth.txt
chmod 600 /tmp/auth.txt

exec openvpn \
  --config /vpn/usv.ovpn \
  --auth-user-pass /tmp/auth.txt
