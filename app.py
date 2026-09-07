"""
Kirt Raj Dixit — portfolio

This file is intentionally small and commented so you can see Flask
full-stack pieces in one place:

  1. Create the app and a secret key (needed for flash messages).
  2. Open a SQLite file and create a table if it does not exist.
  3. Map URLs to Python functions with @app.route.
  4. Render Jinja templates and pass data from config.py.
  5. Accept a POST form, validate it on the server, then redirect.

When you later learn Django, the same ideas appear as:
  urls.py (routes), views.py (these functions), models.py (the inbox table),
  and templates/ (the HTML you already have).
"""

from __future__ import annotations

import os
import sqlite3
from datetime import datetime
from pathlib import Path

from flask import Flask, flash, g, redirect, render_template, request, url_for

from config import (
    ABOUT_POINTS,
    EDUCATION,
    EXPERIENCE,
    LEARNING_TRACK,
    PROFILE,
    PROJECTS,
    SKILL_GROUPS,
)

BASE_DIR = Path(__file__).resolve().parent
INSTANCE_DIR = BASE_DIR / "instance"
DB_PATH = INSTANCE_DIR / "messages.db"

app = Flask(__name__)
# In production, set SECRET_KEY in the host's environment variables.
# The fallback below is only for local development.
app.secret_key = os.environ.get("SECRET_KEY", "kirt-portfolio-dev-key-change-me")


def get_db() -> sqlite3.Connection:
    """Reuse one SQLite connection per request (Flask `g`)."""
    if "db" not in g:
        INSTANCE_DIR.mkdir(exist_ok=True)
        g.db = sqlite3.connect(DB_PATH)
        g.db.row_factory = sqlite3.Row
    return g.db


@app.teardown_appcontext
def close_db(_exception: BaseException | None) -> None:
    db = g.pop("db", None)
    if db is not None:
        db.close()


def init_db() -> None:
    db = get_db()
    db.execute(
        """
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
        """
    )
    db.commit()


@app.before_request
def ensure_db() -> None:
    init_db()


def template_globals() -> dict:
    featured = [project for project in PROJECTS if project.get("featured")]
    return {
        "profile": PROFILE,
        "year": datetime.now().year,
        "nav": [
            ("index", "Home"),
            ("projects", "Projects"),
            ("resume", "Resume"),
            ("contact", "Contact"),
        ],
        "featured_projects": featured,
    }


@app.context_processor
def inject_globals() -> dict:
    return template_globals()


@app.route("/")
def index():
    return render_template(
        "index.html",
        about_points=ABOUT_POINTS,
        skill_groups=SKILL_GROUPS,
        learning_track=LEARNING_TRACK,
    )


@app.route("/projects")
def projects():
    return render_template("projects.html", projects=PROJECTS)


@app.route("/resume")
def resume():
    return render_template(
        "resume.html",
        education=EDUCATION,
        experience=EXPERIENCE,
        skill_groups=SKILL_GROUPS,
    )


@app.route("/contact", methods=["GET", "POST"])
def contact():
    if request.method == "POST":
        name = (request.form.get("name") or "").strip()
        email = (request.form.get("email") or "").strip()
        subject = (request.form.get("subject") or "").strip()
        body = (request.form.get("message") or "").strip()

        errors = []
        if len(name) < 2:
            errors.append("Please enter your name.")
        if "@" not in email or "." not in email:
            errors.append("Please enter a valid email address.")
        if len(subject) < 3:
            errors.append("Please add a short subject.")
        if len(body) < 12:
            errors.append("Please write a message (at least a sentence).")

        if errors:
            for error in errors:
                flash(error, "error")
            return render_template(
                "contact.html",
                form={"name": name, "email": email, "subject": subject, "message": body},
            )

        db = get_db()
        db.execute(
            """
            INSERT INTO messages (name, email, subject, body, created_at)
            VALUES (?, ?, ?, ?, ?)
            """,
            (name, email, subject, body, datetime.utcnow().isoformat(timespec="seconds") + "Z"),
        )
        db.commit()
        flash("Thanks — your message is saved. I will reply by email.", "success")
        return redirect(url_for("contact"))

    return render_template("contact.html", form={})


@app.route("/api/health")
def health():
    """Tiny JSON endpoint — a first look at APIs before Django REST / DRF."""
    return {"ok": True, "app": "kirt-portfolio", "time": datetime.utcnow().isoformat() + "Z"}


if __name__ == "__main__":
    # Local development server. In production the host runs gunicorn instead
    # (see Procfile), so debug mode never reaches the internet.
    app.run(debug=True, host="127.0.0.1", port=5000)
