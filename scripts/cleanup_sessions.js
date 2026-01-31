const fs = require("fs");
const path = require("path");

const SESSIONS_DIR = path.join(process.cwd(), "sessions");
const MAX_AGE_MS = 60 * 60 * 1000; // 1 jam

function isSessionFolder(name) {
  // format: S_1707160000000
  return /^S_\d{10,}$/.test(name);
}

function getTimestamp(name) {
  const m = /^S_(\d{10,})$/.exec(name);
  return m ? Number(m[1]) : null;
}

function rmDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
}

function main() {
  if (!fs.existsSync(SESSIONS_DIR)) {
    console.log("No sessions/ folder. Nothing to clean.");
    return;
  }

  const now = Date.now();
  const entries = fs.readdirSync(SESSIONS_DIR, { withFileTypes: true });

  let deleted = 0;

  for (const ent of entries) {
    if (!ent.isDirectory()) continue;

    const name = ent.name;
    if (!isSessionFolder(name)) continue;

    const ts = getTimestamp(name);
    if (!ts) continue;

    const age = now - ts;
    if (age > MAX_AGE_MS) {
      const full = path.join(SESSIONS_DIR, name);
      console.log(`Deleting ${name} (age ${(age / 60000).toFixed(1)} min)`);
      rmDir(full);
      deleted++;
    }
  }

  console.log(`Done. Deleted ${deleted} session folder(s).`);
}

main();
