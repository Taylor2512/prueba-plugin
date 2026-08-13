#!/usr/bin/env bash
set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
REQUIRED_BRANCH="feature/designer-pdfme"
UPSTREAM="/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin"
STATE="$ROOT/.ai/context/haiku/AUTONOMOUS-CAMPAIGN-STATE.json"
PROMPT="$ROOT/.ai/prompts/haiku/PROMPT_EJECUCION_AUTONOMA_COMPLETA.md"
LOG_DIR="$ROOT/.git/claude-haiku-logs"
MAX_PASSES="${MAX_PASSES:-20}"
MAX_TURNS="${MAX_TURNS:-100}"
MODEL="${CLAUDE_MODEL:-haiku}"

mkdir -p "$LOG_DIR"

check_branch() {
  local current
  current="$(git -C "$ROOT" branch --show-current)"
  if [[ "$current" != "$REQUIRED_BRANCH" ]]; then
    echo "STOP-BRANCH expected=$REQUIRED_BRANCH actual=$current" >&2
    exit 2
  fi
}

state_value() {
  node -e "const s=require(process.argv[1]); console.log($2)" "$STATE"
}

check_branch
node "$ROOT/scripts/ai/validate-haiku-autonomous-pack.mjs" "$ROOT"

for ((pass=1; pass<=MAX_PASSES; pass++)); do
  check_branch
  STATUS="$(state_value "$STATE" 's.campaign_status')"
  CURRENT="$(state_value "$STATE" 's.current_task || ""')"

  if [[ "$STATUS" == "complete" ]]; then
    echo "CAMPAIGN COMPLETE"
    "$ROOT/scripts/ai/status-haiku-autonomous.sh"
    exit 0
  fi
  if [[ "$STATUS" == "stopped" ]]; then
    echo "CAMPAIGN STOPPED"
    "$ROOT/scripts/ai/status-haiku-autonomous.sh"
    exit 3
  fi

  echo "=== Haiku pass $pass/$MAX_PASSES | current=$CURRENT ==="
  LOG="$LOG_DIR/pass-$(printf '%02d' "$pass")-$(date +%Y%m%d-%H%M%S).jsonl"

  set +e
  claude -p "$(cat "$PROMPT")" \
    --model "$MODEL" \
    --max-turns "$MAX_TURNS" \
    --permission-mode acceptEdits \
    --add-dir "$UPSTREAM" \
    --output-format stream-json \
    --verbose 2>&1 | tee "$LOG"
  RC=${PIPESTATUS[0]}
  set -e

  check_branch
  if [[ $RC -ne 0 ]]; then
    echo "Claude terminó con exit code $RC. Log: $LOG" >&2
    exit "$RC"
  fi

done

echo "STOP-MAX-PASSES: se alcanzaron $MAX_PASSES pases sin completar." >&2
"$ROOT/scripts/ai/status-haiku-autonomous.sh"
exit 4
