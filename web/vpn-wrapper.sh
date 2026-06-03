#!/bin/sh
LEFT_IP=$(ip -4 addr show eth0 | grep 'inet ' | awk '{print $2}' | cut -d'/' -f1)
sed -i "s/left=.*/left=$LEFT_IP/" /etc/ipsec.conf

# Background watchdog: if ppp0 drops, re-initiate IPsec + L2TP
(
  sleep 30  # give the initial startup.sh sequence time to complete
  while true; do
    if ! ip link show ppp0 >/dev/null 2>&1; then
      echo "[vpn-wrapper] ppp0 down, reconnecting..."
      ipsec auto --down L2TP-PSK 2>/dev/null
      sleep 2
      ipsec auto --up L2TP-PSK 2>/dev/null
      sleep 3
      echo "c myVPN" > /var/run/xl2tpd/l2tp-control 2>/dev/null
    fi
    sleep 15
  done
) &

exec /startup.sh
