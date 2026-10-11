import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { SEED_USERS, SEED_SCHEMES, SEED_APPS } from "./seedData.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, "db.json");

function getInitialData() {
  return {
    users: JSON.parse(JSON.stringify(SEED_USERS)),
    schemes: JSON.parse(JSON.stringify(SEED_SCHEMES)),
    apps: JSON.parse(JSON.stringify(SEED_APPS))
  };
}

export const db = {
  read() {
    try {
      if (!fs.existsSync(DB_FILE)) {
        const initial = getInitialData();
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
        return initial;
      }
      const raw = fs.readFileSync(DB_FILE, "utf-8");
      return JSON.parse(raw);
    } catch (err) {
      console.error("Error reading database file, reinitializing:", err);
      const initial = getInitialData();
      fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
      return initial;
    }
  },

  write(data) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
      return true;
    } catch (err) {
      console.error("Error writing database file:", err);
      return false;
    }
  },

  reset() {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), "utf-8");
    return initial;
  }
};
