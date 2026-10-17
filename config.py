"""
Edit this file to update your portfolio content.
The Flask app reads these dictionaries and passes them into templates.
"""

PROFILE = {
    "name": "Kirt Raj Dixit",
    "short_name": "Kirt",
    "initials": "KRD",
    "title": "2nd Year Computer Science Student",
    "headline": "Building full-stack foundations — data, interfaces, and systems.",
    "location": "India",
    "email": "kirtdxt1@gmail.com",
    "github": "https://github.com/coderkirt",
    "linkedin": "https://www.linkedin.com/in/kirt-raj-dixit-6573b6387/",
    "availability": "Open to internships, open-source, and student collaborations",
    "summary": (
        "I am a second-year CS student learning how real products are built end to end. "
        "I already work with Git, SQL, and the web stack, and I am now studying Flask and Django "
        "so I can connect interfaces to databases, APIs, and clean backend logic. "
        "My recent work includes an SIH phishing-intelligence project and a Deep Q-Network Snake agent."
    ),
}

ABOUT_POINTS = [
    {
        "label": "Now",
        "text": "Learning Flask, Django, REST APIs, and how a request travels from browser to database.",
    },
    {
        "label": "Build",
        "text": "Ship small, complete projects: schema, backend, UI, and a README that another student can run.",
    },
    {
        "label": "Practice",
        "text": "Data structures, SQL design, and version control on every assignment — not only when a repo is public.",
    },
]

SKILL_GROUPS = [
    {
        "name": "Languages",
        "blurb": "What I write in most weeks",
        "skills": [
            {"name": "Python", "level": "Completed", "progress": 92, "note": "Scripts, Flask, ML experiments"},
            {"name": "JavaScript", "level": "Completed", "progress": 88, "note": "DOM, forms, Chrome extension logic"},
            {"name": "SQL", "level": "Completed", "progress": 90, "note": "Queries, joins, constraints"},
            {"name": "HTML & CSS", "level": "Completed", "progress": 93, "note": "Semantic pages and responsive layout"},
            {"name": "C / C++", "level": "Completed", "progress": 82, "note": "DSA and programming fundamentals"},
        ],
    },
    {
        "name": "Web & Full-stack",
        "blurb": "The path I am on this year",
        "skills": [
            {"name": "Flask", "level": "Completed", "progress": 85, "note": "Routes, Jinja, forms, SQLite — this site"},
            {"name": "Django", "level": "Learning", "progress": 55, "note": "MTV, models, admin, auth"},
            {"name": "REST APIs", "level": "Completed", "progress": 80, "note": "JSON endpoints and request flow"},
            {"name": "Chrome Extension APIs", "level": "Completed", "progress": 87, "note": "Manifest V3, content scripts"},
            {"name": "Jinja / templating", "level": "Completed", "progress": 86, "note": "Inheritance, filters, forms"},
        ],
    },
    {
        "name": "Data & Backend",
        "blurb": "How I think about storage",
        "skills": [
            {"name": "MySQL", "level": "Completed", "progress": 90, "note": "Tables, keys, normalization"},
            {"name": "SQLite", "level": "Completed", "progress": 92, "note": "Local apps and this portfolio inbox"},
            {"name": "Database Design", "level": "Completed", "progress": 88, "note": "ER models and relationships"},
            {"name": "Git & GitHub", "level": "Completed", "progress": 94, "note": "Branches, PRs, commit history"},
        ],
    },
    {
        "name": "CS Foundations",
        "blurb": "Second-year classroom plus practice",
        "skills": [
            {"name": "Data Structures", "level": "Completed", "progress": 84, "note": "Arrays, lists, trees, hash maps"},
            {"name": "OOP", "level": "Completed", "progress": 89, "note": "Classes, encapsulation, reuse"},
            {"name": "Operating Systems", "level": "Completed", "progress": 80, "note": "Processes, memory, files"},
            {"name": "Computer Networks", "level": "Completed", "progress": 81, "note": "HTTP, TCP, client–server"},
        ],
    },
    {
        "name": "From recent projects",
        "blurb": "Tools I touched while shipping",
        "skills": [
            {"name": "FastAPI", "level": "Completed", "progress": 78, "note": "PhishEye backend services"},
            {"name": "React + Vite", "level": "Learning", "progress": 60, "note": "Dashboard UI for scans"},
            {"name": "PyTorch", "level": "Learning", "progress": 58, "note": "DQN for Snake RL"},
            {"name": "PyGame", "level": "Completed", "progress": 86, "note": "Game environment and training loop"},
        ],
    },
]

PROJECTS = [
    {
        "slug": "phisheye",
        "title": "PhishEye",
        "eyebrow": "SIH · Security · Full-stack",
        "status": "Active",
        "year": "2026",
        "image": "images/phisheye.png",
        "image_alt": "PhishEye web threat analysis system — landing page with URL analyzer and analysis pipeline",
        "summary": (
            "An AI-assisted multi-channel scam intelligence system. It scores URLs, pasted messages, "
            "QR codes, and page links from a Chrome extension instead of acting like a single URL checker."
        ),
        "highlights": [
            "FastAPI backend with SQLite history, reports, and fused risk signals",
            "React dashboard for scan, history, and community reputation",
            "Manifest V3 extension that reads visible page links",
            "Honest threat model: scores are evidence fusion, not calibrated fraud probability",
        ],
        "stack": ["Python", "FastAPI", "SQLite", "React", "Chrome Extension APIs", "JavaScript"],
        "links": [
            {"label": "Live", "url": "https://phisheye-web-fhn5.onrender.com/"},
            {"label": "GitHub", "url": "https://github.com/coderkirt/SIH-1454-Phishing-Domain-Detection"},
        ],
        "featured": True,
    },
    {
        "slug": "snake-rl",
        "title": "Snake RL Agent",
        "eyebrow": "Machine Learning · Python",
        "status": "Complete",
        "year": "2026",
        "image": "images/snake-rl.png",
        "image_alt": "Snake game window during DQN training — score 7, length 10, best 17",
        "summary": (
            "A seven-day Deep Q-Network project that teaches an agent to play Snake. "
            "The environment, 11-value state vector, replay memory, and training loop are all written from scratch."
        ),
        "highlights": [
            "PyGame environment with step(), rewards, and keyboard play",
            "3-layer DQN in PyTorch with experience replay and Bellman updates",
            "Live score plots, best-score tracking, and GIF recordings",
            "Repeatable runs via shared hyperparameters and seeding",
        ],
        "stack": ["Python", "PyTorch", "PyGame", "Matplotlib"],
        "links": [],
        "featured": True,
    },
    {
        "slug": "portfolio",
        "title": "This Portfolio",
        "eyebrow": "Flask · Full-stack fundamentals",
        "status": "Learning build",
        "year": "2026",
        "summary": (
            "A Flask site used as a classroom for routing, Jinja templates, static assets, "
            "form handling, and a SQLite inbox. The same ideas map later to Django's MTV pattern."
        ),
        "highlights": [
            "Template inheritance with a shared base layout",
            "Contact form validated on the server and stored in SQLite",
            "Content kept in config.py so copy can change without touching routes",
            "Printable resume page and accessible, responsive UI",
        ],
        "stack": ["Python", "Flask", "Jinja", "SQLite", "HTML", "CSS", "JavaScript"],
        "links": [],
        "featured": False,
    },
    {
        "slug": "bloodlink",
        "title": "BloodLink",
        "eyebrow": "Health · Mobile-first web app",
        "status": "Active",
        "year": "2026",
        "image": "images/bloodlink.png",
        "image_alt": "BloodLink app — find a compatible donor fast, with urgent request, donor signup, and nearby requests",
        "summary": (
            "A responsive web app that connects people who urgently need blood with nearby donors. "
            "The layout is capped at a 480px column so it always reads like a mobile screen, and it "
            "runs in any phone browser today — with a Capacitor wrap planned for an installable app."
        ),
        "highlights": [
            "Three clear entry flows: request blood urgently, register as a donor, view nearby requests",
            "Mobile-first responsive layout capped at a 480px column",
            "Works in the browser on any phone with no install",
            "Capacitor wrap planned to ship the same code as a native app",
        ],
        "stack": ["HTML", "CSS", "JavaScript", "Responsive UI", "Capacitor (planned)"],
        "links": [],
        "featured": True,
    },
    {
        "slug": "smarty-iot",
        "title": "Smarty — IoT Security System",
        "eyebrow": "IoT · Embedded · Hardware",
        "status": "Complete",
        "year": "2025",
        "image": "images/smarty-iot.jpg",
        "image_alt": "IoT security prototype in a wooden box: NodeMCU, PIR sensor, laser and LDR receiver, buzzer, status LED, ESP32-CAM, and a 5V supply on a breadboard",
        "summary": (
            "A laser + PIR + ESP32-CAM based intrusion system that detects human presence. "
            "When the laser beam is broken, the system sends an alert signal to the user and "
            "triggers an audible alarm on the spot."
        ),
        "highlights": [
            "Laser tripwire across an entry point detects the beam break instantly",
            "PIR sensor confirms human presence to reduce false alarms",
            "ESP32-CAM sends the alert signal to the user over the network",
            "Local buzzer alarm fires immediately on intrusion",
        ],
        "stack": ["ESP32-CAM", "PIR sensor", "Laser tripwire", "Buzzer alarm", "C++"],
        "links": [{"label": "GitHub", "url": "https://github.com/coderkirt/Smart-IoT-Security-System"}],
        "featured": True,
    },
    {
        "slug": "fundmatch",
        "title": "FundMatch",
        "eyebrow": "AI · Government schemes · Startups",
        "status": "Active",
        "year": "2026",
        "image": "images/fundmatch.png",
        "image_alt": "FundMatch dashboard showing relevant schemes, eligibility, and funding sought for a startup",
        "summary": (
            "An AI-powered platform that helps a startup find government schemes it can actually apply for. "
            "It reads the startup's story, onboarding form, and website, then scores official schemes for fit and eligibility."
        ),
        "highlights": [
            "Builds a picture of the startup from its story, onboarding answers, and website",
            "Classifies sector, stage, location, technology, funding needs, and future plans",
            "Pulls and processes scheme information from official government sources",
            "Returns the full set of relevant schemes, scored for match and eligibility, rather than a fixed list",
        ],
        "stack": ["AI classification", "Eligibility matching", "Official scheme data", "Web dashboard"],
        "links": [
            {"label": "Live", "url": "https://fundmatch-web.onrender.com/"},
            {"label": "Backend", "url": "https://fundmatch-api.onrender.com/health"},
        ],
        "featured": True,
    },
    {
        "slug": "sql-studio",
        "title": "Schema Studio (planned)",
        "eyebrow": "MySQL · Database Design",
        "status": "Next",
        "year": "2026",
        "summary": (
            "A small Django or Flask lab for designing schemas, writing joins, and viewing query plans. "
            "The goal is to turn coursework ER diagrams into a running app with seed data."
        ),
        "highlights": [
            "Normalized tables for a campus or inventory domain",
            "CRUD screens generated from models",
            "Saved queries with explanations of indexes and keys",
        ],
        "stack": ["MySQL", "SQL", "Django", "Database Design"],
        "links": [],
        "featured": False,
    },
]

EDUCATION = [
    {
        "school": "Undergraduate — Computer Science",
        "detail": "2nd year",
        "dates": "2024 — present",
        "notes": [
            "Core: programming, DSA, DBMS, OS, and computer networks",
            "Self-study: Flask, Django, Git workflows, and browser-extension APIs",
            "Applying classroom SQL and design work to real project schemas",
        ],
    },
]

EXPERIENCE = [
    {
        "role": "Student developer — PhishEye (SIH)",
        "org": "Academic / Smart India Hackathon track",
        "dates": "2025 — 2026",
        "notes": [
            "Contributed to a multi-channel phishing intelligence stack: API, dashboard, and Chrome extension.",
            "Worked with URL and message signals, SQLite persistence, and a privacy-aware threat model.",
        ],
    },
    {
        "role": "Independent project — Snake RL Agent",
        "org": "Personal",
        "dates": "2026",
        "notes": [
            "Implemented a complete DQN training loop: environment, state encoding, replay, and evaluation.",
            "Documented a day-by-day build so another student can reproduce the run.",
        ],
    },
]

# Dates and grades below are taken from the posted resume PDF.
# Class 10 and Class 12 years are not printed on that file, so those
# entries are labeled by class rather than an assumed calendar year.
TIMELINE = [
    {
        "when": "Class 10",
        "title": "High school",
        "text": (
            "Kendriya Vidyalaya Aliganj, Lucknow. Finished Class 10 with 86%."
        ),
        "code_by": "Brian Kernighan, with Dennis Ritchie — the first program in The C Programming Language, 1978. Not my code.",
        "code": 'main()\n{\n    printf("hello, world\\n");\n}',
    },
    {
        "when": "Class 12",
        "title": "Senior secondary",
        "text": (
            "Kendriya Vidyalaya Aliganj, Lucknow. Finished Class 12 with 83%."
        ),
    },
    {
        "when": "2024",
        "title": "B.Tech, Computer Science",
        "text": (
            "PSIT, Kanpur. Started January 2024, through January 2028. "
            "First-year CGPA 8.56/10."
        ),
        "code_by": "Linus Torvalds, 2000, on the Linux kernel mailing list. Not my code.",
        "code": "Talk is cheap.\nShow me the code.",
    },
    {
        "when": "First year",
        "title": "Three projects",
        "text": (
            "TrashTrack, a pothole detector that logs damage and forwards complaints to Nagar Nigam. "
            "An IoT laser security system on Arduino that captures a photo and alerts the owner when the beam breaks. "
            "A JavaScript browser extension that checks URLs and warns before a phishing site."
        ),
        "code_by": "Blink — the first sketch in the Arduino documentation. The same shape as the laser system: a pin changes, and something answers. Not my code.",
        "code": (
            "void setup() {\n"
            "  pinMode(LED_BUILTIN, OUTPUT);\n"
            "}\n"
            "\n"
            "void loop() {\n"
            "  digitalWrite(LED_BUILTIN, HIGH);\n"
            "  delay(1000);\n"
            "  digitalWrite(LED_BUILTIN, LOW);\n"
            "  delay(1000);\n"
            "}"
        ),
    },
    {
        "when": "Certificates",
        "title": "Python and Claude Code",
        "text": "Python Advanced from CodeWithHarry. Claude Code 101 from Anthropic.",
    },
    {
        "when": "2026",
        "title": "Campus, hackathons, outreach",
        "text": (
            "First-Year Promotional Head for IGNITA 2K26. "
            "Selected for the college team at Smart India Hackathon 2026. "
            "Participated in the MOSIP Decode hackathon at the Digital Governance Summit 2026."
        ),
    },
]

# Interactive chapter reader on the home page. Facts match the posted resume.
CHAPTERS = [
    {
        "title": "Timeline",
        "kicker": "A chronological journey",
        "kind": "timeline",
    },
    {
        "title": "Education",
        "kicker": "School, then college",
        "entries": [
            {
                "when": "Class 10",
                "title": "Kendriya Vidyalaya Aliganj",
                "text": "Lucknow. High school, 86%.",
            },
            {
                "when": "Class 12",
                "title": "Kendriya Vidyalaya Aliganj",
                "text": "Lucknow. Senior secondary, 83%.",
            },
            {
                "when": "2024–2028",
                "title": "PSIT, Kanpur",
                "text": "B.Tech in Computer Science & Engineering. First-year CGPA 8.56/10.",
            },
        ],
    },
    {
        "title": "Projects",
        "kicker": "Three builds from the first year",
        "entries": [
            {
                "when": "Python",
                "title": "TrashTrack",
                "text": "Pothole and road-damage detection from images and sensors, with a report path into Nagar Nigam.",
            },
            {
                "when": "IoT",
                "title": "Laser security system",
                "text": "Arduino intrusion detector. A broken laser beam triggers a camera and a photo alert to the owner.",
            },
            {
                "when": "JavaScript",
                "title": "Phishing extension",
                "text": "A browser extension that checks the URL in real time and warns before a suspicious site.",
            },
        ],
    },
    {
        "title": "Campus",
        "kicker": "2026",
        "entries": [
            {
                "when": "IGNITA",
                "title": "First-Year Promotional Head",
                "text": "Promoted IGNITA 2K26 to first-year students and coordinated outreach with the organizing team.",
            },
            {
                "when": "SIH",
                "title": "Smart India Hackathon",
                "text": "Selected for the college team at Smart India Hackathon 2026.",
            },
            {
                "when": "MOSIP",
                "title": "Decode hackathon",
                "text": "Participated in MOSIP Decode at the Digital Governance Summit 2026.",
            },
        ],
    },
    {
        "title": "Now",
        "kicker": "Second year",
        "entries": [
            {
                "when": "Study",
                "title": "Computer science at PSIT",
                "text": "Second-year B.Tech. Coursework plus Flask, Django, SQL, and the projects on this site.",
            },
            {
                "when": "Next",
                "title": "Open to an internship",
                "text": "Looking for a software engineering internship where I can ship a small, real feature.",
            },
        ],
    },
    {
        "title": "Code",
        "kicker": "A first program, a quote, and a blink",
        "kind": "code",
    },
]

# Famous programs shown in the Code chapter. None of this is my work.
CODE_SPOTLIGHT = [
    {
        "author": "Kernighan",
        "credit": "Brian Kernighan, with Dennis Ritchie",
        "year": "1978",
        "lang": "C",
        "title": "hello, world",
        "note": "The first program in The C Programming Language. Four lines, and people are still starting here.",
        "code": 'main()\n{\n    printf("hello, world\\n");\n}',
    },
    {
        "author": "Linus",
        "credit": "Linus Torvalds",
        "year": "2000",
        "lang": "Quote",
        "title": "Show me the code",
        "note": "Written on the Linux kernel mailing list. Two sentences, and the argument is over.",
        "code": "Talk is cheap.\nShow me the code.",
    },
    {
        "author": "Arduino",
        "credit": "The Blink sketch, from the Arduino documentation",
        "year": "2005",
        "lang": "C++",
        "title": "Blink",
        "note": "A pin goes high, then low. The laser system is the same idea: a signal changes, and something answers.",
        "code": (
            "void setup() {\n"
            "  pinMode(LED_BUILTIN, OUTPUT);\n"
            "}\n"
            "\n"
            "void loop() {\n"
            "  digitalWrite(LED_BUILTIN, HIGH);\n"
            "  delay(1000);\n"
            "  digitalWrite(LED_BUILTIN, LOW);\n"
            "  delay(1000);\n"
            "}"
        ),
    },
]

LEARNING_TRACK = [
    {"week": "1–2", "focus": "Flask routes, templates, static files, and this site"},
    {"week": "3–4", "focus": "Forms, validation, SQLite, and a simple REST endpoint"},
    {"week": "5–6", "focus": "Django models, admin, auth, and migrating the contact inbox"},
    {"week": "7+", "focus": "Deploy a small app, write tests, and add one real MySQL schema"},
]
