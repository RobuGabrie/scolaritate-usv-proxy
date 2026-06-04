FROM alpine:3.19
RUN apk add --no-cache openvpn iputils
COPY usv.ovpn /vpn/usv.ovpn
COPY entrypoint.sh /vpn/entrypoint.sh
RUN chmod +x /vpn/entrypoint.sh
ENTRYPOINT ["/vpn/entrypoint.sh"]
