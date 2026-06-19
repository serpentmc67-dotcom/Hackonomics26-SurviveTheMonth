"""
Survive the Month — Player Registration + Scoring Server
"""

import sqlite3, re, os, json
from datetime import datetime, timezone, timedelta
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn, TCPServer
from urllib.parse import urlparse
# Replacing hashlib with Werkzeug helpers
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.environ.get("DB_PATH", "./data/players.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

# Secret key that the admin code form checks against
ADMIN_SECRET_CODE = os.environ.get("ADMIN_SECRET_CODE", "MySuperSecretCode123")

def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=15, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL")   # allows concurrent reads + writes
    conn.execute("PRAGMA synchronous=NORMAL") # faster writes, still safe
    conn.execute("PRAGMA cache_size=10000")
    return conn

class ThreadedHTTPServer(ThreadingMixIn, TCPServer):
    allow_reuse_address = True

def init_db():
    conn = get_conn()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS players (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            username   TEXT NOT NULL UNIQUE,
            password   TEXT NOT NULL,
            school     TEXT NOT NULL,
            registered TEXT NOT NULL,
            score      INTEGER DEFAULT 0,
            play_seconds INTEGER DEFAULT 0,
            last_played  TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS system_logs (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            event     TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            meta      TEXT
        )
    """)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS play_sessions (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id  INTEGER NOT NULL,
            started_at TEXT NOT NULL,
            ended_at   TEXT,
            seconds    INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()
    print(f"[DB] Ready: {DB_PATH}")

def get_et():
    ET = timezone(timedelta(hours=-4))
    return datetime.now(ET).strftime("%Y-%m-%d %H:%M:%S")

def create_system_log(event, meta=None):
    ts = get_et()
    conn = get_conn()
    meta_str = json.dumps(meta) if meta else None
    try:
        conn.execute("INSERT INTO system_logs (event, timestamp, meta) VALUES (?, ?, ?)", (event, ts, meta_str))
        conn.commit()
    except Exception as e:
        print(f"[LOG ERROR] {e}")
    finally:
        conn.close()

# --- REPLACED HASHLIB WITH WERKZEUG ---
def hash_password(password):
    # Generates a secure, salted cryptographic hash string
    return generate_password_hash(password)

def register_player(username, password, school):
    username = username.strip()
    school = school.strip()
    
    if not username or not password or not school:
        return {"ok": False, "message": "All fields are required."}
        
    ts = get_et()
    conn = get_conn()
    try:
        existing = conn.execute("SELECT id FROM players WHERE username = ?", (username,)).fetchone()
        if existing:
            create_system_log("Registration Failed: Username taken", {"username": username})
            return {"ok": False, "message": "Username is already taken."}
            
        hashed = hash_password(password)
        cur = conn.execute(
            "INSERT INTO players (username, password, school, registered) VALUES (?, ?, ?, ?)",
            (username, hashed, school, ts)
        )
        conn.commit()
        pid = cur.lastrowid
        
        create_system_log("User Registered", {"username": username, "school": school})
        print(f"[DB] Registered User #{pid} — {username} ({school})")
        return {"ok": True, "message": "User registered successfully!"}
    except Exception as e:
        print(f"[DB] Error: {e}")
        return {"ok": False, "message": "Database error during registration."}
    finally:
        conn.close()

def login_player(username, password):
    username = username.strip()
    if not username or not password:
        return {"ok": False, "message": "Username and password are required."}
        
    conn = get_conn()
    try:
        user = conn.execute("SELECT id, password, school FROM players WHERE username = ?", (username,)).fetchone()
        if not user:
            create_system_log("Login Failed: User not found", {"username": username})
            return {"ok": False, "message": "Invalid username or password."}
            
        pid, db_hashed_password, school = user
        
        # --- REPLACED MANUAL COMPARE WITH WERKZEUG CHECK ---
        # Werkzeug extracts the salt right out of db_hashed_password automatically
        if check_password_hash(db_hashed_password, password):
            create_system_log("User Logged In", {"username": username, "school": school})
            print(f"[DB] User Logged In — {username}")
            return {"ok": True, "message": "Logged in successfully!", "user": {"id": pid, "username": username, "school": school}}
        else:
            create_system_log("Login Failed: Incorrect password", {"username": username})
            return {"ok": False, "message": "Invalid username or password."}
    except Exception as e:
        print(f"[DB] Login Error: {e}")
        return {"ok": False, "message": "Database error during login."}
    finally:
        conn.close()

def get_logs():
    conn = get_conn()
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT id as _id, event, timestamp, meta FROM system_logs ORDER BY id DESC LIMIT 100").fetchall()
    conn.close()
    
    formatted_logs = []
    for r in rows:
        d = dict(r)
        if d["meta"]:
            try:
                d["meta"] = json.loads(d["meta"])
            except:
                pass
        formatted_logs.append(d)
    return formatted_logs

class GameHandler(SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args):
        if "/api/" in str(args[0]):
            print(f"[HTTP] {args[0]}")

    def _json(self, data, status=200):
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "POST, GET, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self._json({"cors": "ok"})

    def do_POST(self):
        path = urlparse(self.path).path
        n = int(self.headers.get("Content-Length", 0))
        try:
            data = json.loads(self.rfile.read(n)) if n else {}
        except Exception:
            self._json({"ok": False, "message": "Invalid JSON."}, 400)
            return

        clean_path = path.rstrip('/')

        if clean_path == "/api/auth/register":
            result = register_player(
                data.get("username", ""),
                data.get("password", ""),
                data.get("school", "")
            )
            self._json(result, 200 if result["ok"] else 400)
            
        elif clean_path == "/api/auth/login":
            result = login_player(
                data.get("username", ""),
                data.get("password", "")
            )
            self._json(result, 200 if result["ok"] else 400)
            
        elif clean_path == "/api/admin/logs":
            secret_code = data.get("secretCode", "")
            if not secret_code or secret_code != ADMIN_SECRET_CODE:
                create_system_log("Unauthorized Admin View Attempt")
                self._json({"ok": False, "message": "Access Denied."}, 403)
                return
                
            logs_list = get_logs()
            create_system_log("Admin Logs Viewed Successfully")
            self._json({"ok": True, "logs": logs_list}, 200)
            
        else:
            self._json({"ok": False, "message": "Endpoint not found."}, 404)

    def do_GET(self):
        path = urlparse(self.path).path
        clean_path = path.rstrip('/')
        
        if clean_path == "/api/admin/logs":
            self._json({"ok": False, "message": "Method Not Allowed. Use POST."}, 405)
        else:
            self._json({"ok": False, "message": "Endpoint not found."}, 404)

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 5000))
    srv = ThreadedHTTPServer(("0.0.0.0", port), GameHandler)
    print(f"\n[Server] Python Backend running on port {port}\n")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down.")