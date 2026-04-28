"""
Survive the Month — Player Registration + Scoring Server
"""

import sqlite3, re, os, json
from datetime import datetime, timezone, timedelta
from http.server import SimpleHTTPRequestHandler
from socketserver import ThreadingMixIn, TCPServer
from urllib.parse import urlparse

DB_PATH = os.environ.get("DB_PATH", "/data/players.db")
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
class ThreadedHTTPServer(ThreadingMixIn, TCPServer):
    allow_reuse_address = True

def init_db():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS players (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            first_name TEXT NOT NULL,
            last_name  TEXT NOT NULL,
            email      TEXT NOT NULL,
            registered TEXT NOT NULL
        )
    """)
    for col_def in [
        ("score",        "INTEGER DEFAULT 0"),
        ("play_seconds", "INTEGER DEFAULT 0"),
        ("last_played",  "TEXT"),
    ]:
        try:
            conn.execute(f"ALTER TABLE players ADD COLUMN {col_def[0]} {col_def[1]}")
        except sqlite3.OperationalError:
            pass

    conn.execute("""
        CREATE TABLE IF NOT EXISTS score_events (
            id        INTEGER PRIMARY KEY AUTOINCREMENT,
            player_id INTEGER NOT NULL,
            delta     INTEGER NOT NULL,
            reason    TEXT,
            ts        TEXT NOT NULL
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

def register_player(first_name, last_name, email):
    first_name = first_name.strip()
    last_name  = last_name.strip()
    email      = email.strip().lower()
    if not first_name or not last_name:
        return {"ok": False, "error": "First and last name are required."}
    if not re.match(r"^[^@\s]+@[^@\s]+\.[^@\s]+$", email):
        return {"ok": False, "error": "Please enter a valid email address."}
    ts = get_et()
    conn = sqlite3.connect(DB_PATH, timeout=10)
    try:
        cur = conn.execute(
            "INSERT INTO players (first_name, last_name, email, registered, score, play_seconds) VALUES (?,?,?,?,0,0)",
            (first_name, last_name, email, ts)
        )
        conn.commit()
        pid   = cur.lastrowid
        total = conn.execute("SELECT COUNT(*) FROM players").fetchone()[0]
        print(f"[DB] #{pid} — {first_name} {last_name} <{email}>")
        return {"ok": True, "id": pid, "total": total}
    except Exception as e:
        print(f"[DB] Error: {e}")
        return {"ok": False, "error": "Database error. Please try again."}
    finally:
        conn.close()

def list_players():
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    rows = conn.execute(
        "SELECT id, first_name, last_name, email, registered, score, play_seconds, last_played FROM players ORDER BY score DESC, id DESC"
    ).fetchall()
    conn.close()
    return [dict(r) for r in rows]

def start_session(player_id):
    ts = get_et()
    conn = sqlite3.connect(DB_PATH, timeout=10)
    try:
        conn.execute(
            "UPDATE play_sessions SET ended_at=?, seconds=CAST((julianday(?) - julianday(started_at))*86400 AS INTEGER) WHERE player_id=? AND ended_at IS NULL",
            (ts, ts, player_id)
        )
        cur = conn.execute(
            "INSERT INTO play_sessions (player_id, started_at) VALUES (?,?)",
            (player_id, ts)
        )
        session_id = cur.lastrowid
        conn.commit()
        return {"ok": True, "session_id": session_id}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    finally:
        conn.close()

def end_session(player_id, session_id, seconds):
    ts = get_et()
    conn = sqlite3.connect(DB_PATH, timeout=10)
    try:
        conn.execute(
            "UPDATE play_sessions SET ended_at=?, seconds=? WHERE id=? AND player_id=?",
            (ts, seconds, session_id, player_id)
        )
        time_bonus = seconds // 30
        conn.execute(
            "UPDATE players SET play_seconds = play_seconds + ?, score = score + ?, last_played=? WHERE id=?",
            (seconds, time_bonus, ts, player_id)
        )
        if time_bonus > 0:
            conn.execute(
                "INSERT INTO score_events (player_id, delta, reason, ts) VALUES (?,?,?,?)",
                (player_id, time_bonus, f"Time bonus ({seconds}s played)", ts)
            )
        conn.commit()
        return {"ok": True, "time_bonus": time_bonus}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    finally:
        conn.close()

def add_score(player_id, delta, reason):
    ts = get_et()
    conn = sqlite3.connect(DB_PATH, timeout=10)
    try:
        conn.execute(
            "UPDATE players SET score = MAX(0, score + ?), last_played=? WHERE id=?",
            (delta, ts, player_id)
        )
        conn.execute(
            "INSERT INTO score_events (player_id, delta, reason, ts) VALUES (?,?,?,?)",
            (player_id, delta, reason, ts)
        )
        conn.commit()
        row = conn.execute("SELECT score FROM players WHERE id=?", (player_id,)).fetchone()
        new_score = row[0] if row else 0
        return {"ok": True, "new_score": new_score}
    except Exception as e:
        return {"ok": False, "error": str(e)}
    finally:
        conn.close()

def get_player_score(player_id):
    conn = sqlite3.connect(DB_PATH, timeout=10)
    conn.row_factory = sqlite3.Row
    row = conn.execute(
        "SELECT score, play_seconds FROM players WHERE id=?", (player_id,)
    ).fetchone()
    conn.close()
    if row:
        return {"ok": True, "score": row["score"], "play_seconds": row["play_seconds"]}
    return {"ok": False, "error": "Player not found"}

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
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_POST(self):
        path = urlparse(self.path).path
        n = int(self.headers.get("Content-Length", 0))
        try:
            data = json.loads(self.rfile.read(n)) if n else {}
        except Exception:
            self._json({"ok": False, "error": "Invalid JSON."}, 400); return

        if path == "/api/register":
            result = register_player(
                data.get("first_name", ""),
                data.get("last_name",  ""),
                data.get("email",      "")
            )
            self._json(result, 200 if result["ok"] else 400)
        elif path == "/api/session/start":
            pid = data.get("player_id")
            if not pid:
                self._json({"ok": False, "error": "player_id required"}, 400); return
            self._json(start_session(int(pid)))
        elif path == "/api/session/end":
            pid     = data.get("player_id")
            sid     = data.get("session_id")
            seconds = data.get("seconds", 0)
            if not pid or not sid:
                self._json({"ok": False, "error": "player_id and session_id required"}, 400); return
            self._json(end_session(int(pid), int(sid), int(seconds)))
        elif path == "/api/score/add":
            pid    = data.get("player_id")
            delta  = data.get("delta", 0)
            reason = data.get("reason", "")
            if not pid:
                self._json({"ok": False, "error": "player_id required"}, 400); return
            self._json(add_score(int(pid), int(delta), reason))
        else:
            self._json({"ok": False, "error": "Not found."}, 404)

    def do_GET(self):
        path = urlparse(self.path).path
        if path == "/api/players":
            players = list_players()
            self._json({"ok": True, "count": len(players), "players": players})
        elif path.startswith("/api/score/"):
            pid = path.split("/")[-1]
            try:
                self._json(get_player_score(int(pid)))
            except ValueError:
                self._json({"ok": False, "error": "Invalid player id"}, 400)
        elif path == "/":
            self.send_response(302)
            self.send_header("Location", "/register.html")
            self.end_headers()
        else:
            super().do_GET()

if __name__ == "__main__":
    init_db()
    port = int(os.environ.get("PORT", 8080))
    srv = ThreadedHTTPServer(("0.0.0.0", port), GameHandler)
    print(f"\n[Server] Running on port {port}\n")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\n[Server] Shutting down.")
