Temporary assemble parts for restoring index.html on branch tidy/voice-product-2026-09-16.
Expect index.part-00.b64 .. index.part-04.b64 (gzip+base64 of polished index.html).
Workflow .github/workflows/assemble-index.yml concatenates, gunzips, commits index.html.
Safe to delete this folder + workflow after index.html is restored.
