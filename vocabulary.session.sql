CREATE TABLE IF NOT EXISTS words (
    id integer PRIMARY KEY AUTOINCREMENT,
    english varchar,
    russian varchar,
    pronunciation varchar,
    mistakes int
)