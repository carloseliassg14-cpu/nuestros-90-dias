#!/usr/bin/env python3
"""Arma ../dd.html (Día a día + Dinero) para la app de los 90 días. Uso: python3 dd-src/build.py"""
import pathlib
src = pathlib.Path(__file__).parent
html = (src / "index.html").read_text(encoding="utf-8")
css = (src / "app.css").read_text(encoding="utf-8")
js = "\n".join((src / f).read_text(encoding="utf-8") for f in ["i18n.js", "bank.js", "seed.js", "app.js"])
js = js.replace("/*@@PLAN@@*/", (src / "plan.js").read_text(encoding="utf-8"))
assert "</script" not in js.lower()
out = html.replace("/*@@CSS@@*/", css).replace("/*@@JS@@*/", js)
(src.parent / "dd.html").write_text(out, encoding="utf-8")
print("dd.html", len(out.encode()), "bytes")
