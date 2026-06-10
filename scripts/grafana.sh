#!/usr/bin/env bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="$SCRIPT_DIR/../.env"

if [[ ! -f "$ENV_FILE" ]]; then
  echo "❌  .env not found at $ENV_FILE"
  exit 1
fi

while IFS='=' read -r key value; do
  [[ "$key" =~ ^#.*$ || -z "$key" ]] && continue
  value="${value# }"   # strip leading space
  value="${value%"${value##*[! ]}"}"  # strip trailing space
  export "$key=$value"
done < "$ENV_FILE"

SSH_KEY_EXPANDED=$(eval echo "$SSH_KEY")

echo "→ Opening Grafana tunnel to $SSH_USER@$SSH_HOST"
echo "→ Grafana will be available at http://localhost:3001"
echo "   (Ctrl+C to close)"
echo ""

ssh -i "$SSH_KEY_EXPANDED" \
    -L 3001:localhost:3001 \
    -N \
    "$SSH_USER@$SSH_HOST"
