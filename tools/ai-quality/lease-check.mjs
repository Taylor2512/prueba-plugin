import fs from "node:fs";
import process from "node:process";
import path from "node:path";

const dir = ".ai/leases";
if (!fs.existsSync(dir)) {
  console.log("No leases.");
  process.exit(0);
}

const leases = fs
  .readdirSync(dir)
  .filter((x) => x.endsWith(".json"))
  .map((x) => JSON.parse(fs.readFileSync(path.join(dir, x), "utf8")))
  .filter((x) => x.status === "active");

const overlap = (a, b) =>
  a === b || a.startsWith(b.replace(/\/?$/, "/")) || b.startsWith(a.replace(/\/?$/, "/"));

let bad = 0;
for (let i = 0; i < leases.length; i += 1) {
  for (let j = i + 1; j < leases.length; j += 1) {
    for (const a of leases[i].paths || []) {
      for (const b of leases[j].paths || []) {
        if (overlap(a, b)) {
          console.error(`Overlap ${leases[i].taskId}:${a} / ${leases[j].taskId}:${b}`);
          bad += 1;
        }
      }
    }
  }
}

if (bad) process.exit(1);
console.log("Leases do not overlap.");
