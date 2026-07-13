"""
Survive the Month — Player Registration + Scoring Server
"""

import sqlite3, re, os, json
from datetime import datetime, timezone, timedelta
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn, TCPServer
from urllib.parse import urlparse
from werkzeug.security import generate_password_hash, check_password_hash

DB_PATH = os.environ.get("DB_PATH", "./data/players.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)

ADMIN_SECRET_CODE = os.environ.get("ADMIN_SECRET_CODE", "MySuperSecretCode123")

def get_conn():
    conn = sqlite3.connect(DB_PATH, timeout=15, check_same_thread=False)
    conn.execute("PRAGMA journal_mode=WAL")   
    conn.execute("PRAGMA synchronous=NORMAL") 
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
            last_played  TEXT,
            status     TEXT DEFAULT 'active', -- 'active', 'banned', 'ip_banned'
            ip_address TEXT
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

def hash_password(password):
    return generate_password_hash(password)

def register_player(username, password, school, ip_address=""):
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
            "INSERT INTO players (username, password, school, registered, ip_address) VALUES (?, ?, ?, ?, ?)",
            (username, hashed, school, ts, ip_address)
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

def login_player(username, password, ip_address=""):
    username = username.strip()
    if not username or not password:
        return {"ok": False, "message": "Username and password are required."}
        
    conn = get_conn()
    try:
        user = conn.execute("SELECT id, password, school, status, ip_address FROM players WHERE username = ?", (username,)).fetchone()
        
        # 1. Explicit check if user exists
        if not user:
            create_system_log("Login Failed: User not found", {"username": username})
            return {"ok": False, "message": "User does not exist."}
            
        pid, db_hashed_password, school, status, saved_ip = user
        
        # Check if banned
        if status == 'banned' or status == 'ip_banned':
            return {"ok": False, "message": "This account or IP has been banned."}
            
        # Update IP tracking if it changed
        if ip_address and ip_address != saved_ip:
            conn.execute("UPDATE players SET ip_address = ? WHERE id = ?", (ip_address, pid))
            conn.commit()

        # 2. Check password
        if check_password_hash(db_hashed_password, password):
            ts = get_et()
            conn.execute("UPDATE players SET last_played = ? WHERE id = ?", (ts, pid))
            conn.commit()
            
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
        self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Secret-Code")
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
        client_ip = self.client_address[0]

        if clean_path == "/api/auth/register":
            result = register_player(
                data.get("username", ""),
                data.get("password", ""),
                data.get("school", ""),
                client_ip
            )
            self._json(result, 200 if result["ok"] else 400)
            
        elif clean_path == "/api/auth/login":
            result = login_player(
                data.get("username", ""),
                data.get("password", ""),
                client_ip
            )
            self._json(result, 200 if result["ok"] else 400)
            
        elif clean_path == "/api/admin/stats":
            secret_code = self.headers.get("X-Secret-Code") or data.get("secretCode", "")
            if secret_code != ADMIN_SECRET_CODE:
                self._json({"ok": False, "message": "Access Denied."}, 403)
                return
                
            conn = get_conn()
            total_players = conn.execute("SELECT COUNT(*) FROM players").fetchone()[0]
            # Active within last 5 minutes is marked "Online"
            five_mins_ago = (datetime.now(timezone(timedelta(hours=-4))) - timedelta(minutes=5)).strftime("%Y-%m-%d %H:%M:%S")
            online_players = conn.execute("SELECT COUNT(*) FROM players WHERE last_played >= ?", (five_mins_ago,)).fetchone()[0]
            banned_players = conn.execute("SELECT COUNT(*) FROM players WHERE status != 'active'").fetchone()[0]
            conn.close()
            
            self._json({
                "ok": True,
                "stats": {
                    "totalPlayers": total_players,
                    "onlinePlayers": online_players,
                    "bannedPlayers": banned_players
                }
            })

        elif clean_path == "/api/admin/players":
            secret_code = self.headers.get("X-Secret-Code") or data.get("secretCode", "")
            if secret_code != ADMIN_SECRET_CODE:
                self._json({"ok": False, "message": "Access Denied."}, 403)
                return
                
            conn = get_conn()
            conn.row_factory = sqlite3.Row
            rows = conn.execute("SELECT id, username, school, registered, score, play_seconds, last_played, status, ip_address FROM players ORDER BY id DESC").fetchall()
            conn.close()
            
            players_list = [dict(r) for r in rows]
            self._json({"ok": True, "players": players_list})

        elif clean_path == "/api/admin/action":
            secret_code = self.headers.get("X-Secret-Code") or data.get("secretCode", "")
            if secret_code != ADMIN_SECRET_CODE:
                self._json({"ok": False, "message": "Access Denied."}, 403)
                return
                
            player_id = data.get("playerId")
            action = data.get("action") # 'delete', 'ban', 'ip_ban', 'unban'
            
            if not player_id or not action:
                self._json({"ok": False, "message": "Missing arguments."}, 400)
                return
                
            conn = get_conn()
            try:
                if action == 'delete':
                    conn.execute("DELETE FROM players WHERE id = ?", (player_id,))
                    create_system_log("Admin Action: Deleted User", {"id": player_id})
                elif action == 'ban':
                    conn.execute("UPDATE players SET status = 'banned' WHERE id = ?", (player_id,))
                    create_system_log("Admin Action: Banned User", {"id": player_id})
                elif action == 'ip_ban':
                    user_ip = conn.execute("SELECT ip_address FROM players WHERE id = ?", (player_id,)).fetchone()
                    if user_ip and user_ip[0]:
                        conn.execute("UPDATE players SET status = 'ip_banned' WHERE ip_address = ?", (user_ip[0],))
                    conn.execute("UPDATE players SET status = 'ip_banned' WHERE id = ?", (player_id,))
                    create_system_log("Admin Action: IP Banned User", {"id": player_id})
                elif action == 'unban':
                    conn.execute("UPDATE players SET status = 'active' WHERE id = ?", (player_id,))
                    create_system_log("Admin Action: Unbanned User", {"id": player_id})
                    
                conn.commit()
                self._json({"ok": True, "message": f"Action '{action}' executed successfully."})
            except Exception as e:
                self._json({"ok": False, "message": str(e)}, 500)
            finally:
                conn.close()

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