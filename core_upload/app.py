import os
import io
from datetime import datetime
from flask import Flask, render_template, request, redirect, url_for, send_file, flash
from werkzeug.utils import secure_filename
import mammoth
from html2docx import html2docx
from slugify import slugify

# ========================
# Configuração básica
# ========================
BASE_DIR = os.path.abspath(os.path.dirname(__file__))
UPLOAD_FOLDER = os.path.join(BASE_DIR, "uploads")
EXPORT_FOLDER = os.path.join(BASE_DIR, "exports")
ALLOWED_EXTENSIONS = {"docx"}

os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(EXPORT_FOLDER, exist_ok=True)

app = Flask(__name__)
app.secret_key = "API_KEY=bumveqy4u8no8hl77rnfgq1e91m01hrhx2qnrfb9u5ftziu2"
app.config["MAX_CONTENT_LENGTH"] = 20 * 1024 * 1024  # 20 MB

def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

# ========================
# Rotas
# ========================
@app.route("/", methods=["GET"])
def index():
    return render_template("upload.html")

@app.route("/upload", methods=["POST"])
def upload():
    if "file" not in request.files:
        flash("Nenhum arquivo enviado.")
        return redirect(url_for("index"))

    file = request.files["file"]
    if file.filename == "":
        flash("Selecione um arquivo .docx.")
        return redirect(url_for("index"))

    if file and allowed_file(file.filename):
        safe_name = secure_filename(file.filename)
        path = os.path.join(UPLOAD_FOLDER, safe_name)
        file.save(path)

        # DOCX -> HTML
        with open(path, "rb") as docx_file:
            result = mammoth.convert_to_html(docx_file)
            html_content = result.value  # HTML extraído
            messages = result.messages   # avisos/alertas do mammoth (se quiser exibir)

        # guarda nome do arquivo original para reaproveitar no download
        request.environ["original_filename"] = safe_name
        return render_template("edit.html", html_content=html_content, original_filename=safe_name)

    flash("Formato inválido. Envie um arquivo .docx.")
    return redirect(url_for("index"))

@app.route("/export", methods=["POST"])
def export_docx():
    # HTML vindo do formulário (do editor TinyMCE)
    html = request.form.get("html_content", "")
    original_filename = request.form.get("original_filename", "documento.docx")

    # Converte HTML -> DOCX em memória
    docx_stream = io.BytesIO()
    # Cria um documento DOCX a partir do HTML
    html2docx(html, title="Documento Editado", output=docx_stream)
    docx_stream.seek(0)

    # Gera nome de saída
    base = os.path.splitext(original_filename)[0]
    final_name = f"{slugify(base)}-editado-{datetime.now().strftime('%Y%m%d-%H%M%S')}.docx"

    # Opcional: salvar em disco também
    out_path = os.path.join(EXPORT_FOLDER, final_name)
    with open(out_path, "wb") as f:
        f.write(docx_stream.getbuffer())

    # Envia para download
    docx_stream.seek(0)
    return send_file(
        docx_stream,
        as_attachment=True,
        download_name=final_name,
        mimetype="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )

if __name__ == "__main__":
    # debug=True só em desenvolvimento
    app.run(host="0.0.0.0", port=5000, debug=True)
