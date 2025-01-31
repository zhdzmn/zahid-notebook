import markdownify
file_name = "test.html"

f = open(file_name, "r", encoding="utf-8")
lines = f.readlines()
html_text = "".join(lines)
f.close()

markdownify.markdownify(html_text)
