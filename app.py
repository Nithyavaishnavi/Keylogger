from flask import Flask, render_template, request, jsonify
from datetime import datetime
from pathlib import Path

app = Flask(__name__)

LOG_FILE = Path("key_log.txt")


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/log-key", methods=["POST"])
def log_key():
    data = request.get_json(silent=True) or {}

    key = data.get("key", "")

    if not isinstance(key, str):
        return jsonify({"success": False}), 400

    if len(key) > 50:
        return jsonify({"success": False}), 400

    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    with LOG_FILE.open("a", encoding="utf-8") as file:
        file.write(f"[{timestamp}] {key}\n")

    return jsonify({"success": True})


@app.route("/clear-log", methods=["POST"])
def clear_log():
    LOG_FILE.write_text("", encoding="utf-8")

    return jsonify({"success": True})


if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )