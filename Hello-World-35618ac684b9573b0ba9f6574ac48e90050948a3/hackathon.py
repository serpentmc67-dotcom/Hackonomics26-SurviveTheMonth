# game_database.py
import sqlite3

# ---------------------------
# Database setup
# ---------------------------
DB_FILE = "game_data.db"

def init_db():
    """Create database and table if it doesn't exist"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("""
    CREATE TABLE IF NOT EXISTS player_stats (
        id INTEGER PRIMARY KEY,
        player_name TEXT UNIQUE,
        health INTEGER,
        sanity INTEGER,
        xp INTEGER,
        level INTEGER
    )
    """)
    conn.commit()
    conn.close()

# ---------------------------
# Player functions
# ---------------------------
def add_player(name, health=67, sanity=41, xp=0, level=1):
    """Add a new player with default stats"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    try:
        c.execute("""
        INSERT INTO player_stats (player_name, health, sanity, xp, level)
        VALUES (?, ?, ?, ?, ?)
        """, (name, health, sanity, xp, level))
        conn.commit()
        print(f"Player '{name}' added!")
    except sqlite3.IntegrityError:
        print(f"Player '{name}' already exists!")
    conn.close()

def update_player(name, health=None, sanity=None, xp=None, level=None):
    """Update player stats"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT health, sanity, xp, level FROM player_stats WHERE player_name=?", (name,))
    row = c.fetchone()
    if not row:
        print(f"Player '{name}' not found!")
        conn.close()
        return

    current_health, current_sanity, current_xp, current_level = row
    health = health if health is not None else current_health
    sanity = sanity if sanity is not None else current_sanity
    xp = xp if xp is not None else current_xp
    level = level if level is not None else current_level

    c.execute("""
    UPDATE player_stats
    SET health=?, sanity=?, xp=?, level=?
    WHERE player_name=?
    """, (health, sanity, xp, level, name))
    conn.commit()
    conn.close()
    print(f"Player '{name}' updated: Health={health}%, Sanity={sanity}%, XP={xp}, Level={level}")

def get_player(name):
    """Fetch a player's stats"""
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT * FROM player_stats WHERE player_name=?", (name,))
    row = c.fetchone()
    conn.close()
    if row:
        return {
            "id": row[0],
            "name": row[1],
            "health": row[2],
            "sanity": row[3],
            "xp": row[4],
            "level": row[5]
        }
    return None

# ---------------------------
# Example game logic
# ---------------------------
def gain_xp(name, xp_gain):
    """Increase player's XP and handle leveling up"""
    player = get_player(name)
    if not player:
        return
    new_xp = player["xp"] + xp_gain
    new_level = player["level"]
    health = player["health"]
    sanity = player["sanity"]

    # Level up every 100 XP
    while new_xp >= 100:
        new_xp -= 100
        new_level += 1
        health = min(health + 10, 100)   # Increase max health slightly
        sanity = min(sanity + 10, 100)   # Increase max sanity slightly

    update_player(name, health=health, sanity=sanity, xp=new_xp, level=new_level)

# ---------------------------
# Main example usage
# ---------------------------
if __name__ == "__main__":
    # Initialize database
    init_db()

    # Add some players
    add_player("Player1")
    add_player("Player2", health=80, sanity=55, xp=30)

    # Update player stats
    update_player("Player1", health=67, sanity=41, xp=120)

    # Gain XP and level up example
    gain_xp("Player1", 50)

    # Fetch and print stats
    p1 = get_player("Player1")
    p2 = get_player("Player2")
    print("Player1 Stats:", p1)
    print("Player2 Stats:", p2)