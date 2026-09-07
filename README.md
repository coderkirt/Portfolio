# Kirt Raj Dixit — Portfolio

A Flask portfolio for a 2nd-year CS student. It shows skills, projects, a printable resume, and a contact form that writes to SQLite. The code is small on purpose so you can see full-stack pieces before moving the same ideas into Django.

## Run locally (Windows)

```powershell
cd E:\Project\Portfolio
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python app.py
```

Open [http://127.0.0.1:5000](http://127.0.0.1:5000).

## What to edit first

All personal copy lives in `config.py`:

- name, email, GitHub, LinkedIn
- skills and honesty labels (`Working`, `Learning`, `Coursework`, `Exploring`)
- projects, education, experience

After you change GitHub or email, refresh the page. You do not need to touch routes.

## How the app is put together

| Piece | File | Flask idea | Django cousin |
| --- | --- | --- | --- |
| Routes / views | `app.py` | `@app.route` | `urls.py` + `views.py` |
| Content | `config.py` | Python dicts passed into templates | context or a model |
| HTML | `templates/` | Jinja inheritance | Django templates |
| CSS / JS | `static/` | `url_for('static', ...)` | static files |
| Inbox | `instance/messages.db` | `sqlite3` + form POST | Django model + `ModelForm` |

Useful URLs:

- `/` home
- `/projects`
- `/resume` — use **Print / save PDF**
- `/contact` — POST saves a row
- `/api/health` — tiny JSON response

Read saved messages:

```powershell
python -c "import sqlite3; c=sqlite3.connect('instance/messages.db'); print(c.execute('select id,name,email,subject,created_at from messages').fetchall())"
```

## Suggested next steps (learning path)

1. Change your real email and social links in `config.py`.
2. Add a project GitHub URL to the `links` list in `PROJECTS`.
3. Move the inbox table into a Django app (`Message` model + admin).
4. Deploy with a real mail backend instead of local SQLite.

Do not commit `instance/messages.db` — it can contain other people's email addresses.
