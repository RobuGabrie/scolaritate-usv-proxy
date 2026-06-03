#!/bin/sh
#
# Called by pppd on every successful PPP connection.
# $1 = interface name (e.g. ppp0)
#
# Route USV servers via the VPN tunnel.
# NOTE: the VPN server itself (80.96.122.118) must stay via eth0 — do NOT add
# a broader /24 here or it breaks the IPsec tunnel.
ip route add 80.96.122.141/32 dev "$1" 2>/dev/null || true   # scolaritate.usv.ro
echo "[ppp-ip-up] route 80.96.122.141/32 via $1 added"
