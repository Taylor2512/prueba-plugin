#!/usr/bin/env python3
import json, re, sys
try:
    payload = json.load(sys.stdin)
except Exception:
    payload = {}
text = json.dumps(payload, ensure_ascii=False)
blocked = [r'\brm\s+-rf\s+/(?:\s|$)', r'\bgit\s+reset\s+--hard\b', r'\bgit\s+clean\s+-fdx\b', r'\bforce-push\b']
if any(re.search(p, text) for p in blocked):
    print(json.dumps({"decision": "deny", "reason": "Destructive command blocked by SISAD project policy."}))
else:
    print(json.dumps({"decision": "allow"}))
