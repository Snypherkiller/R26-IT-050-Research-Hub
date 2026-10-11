# R26-IT-050 Research Hub

Dark-themed static research file website inspired by the structure of the EcoGarden downloads page, with an original layout.

## Run locally

Install Python 3, open a terminal in this folder, and run:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000

Do not open `index.html` via `file://` because the browser will block the JSON manifest request.

## Deploy on GitHub Pages

1. Upload the contents of this folder (including `assets/`) to a GitHub repository.
2. In **Settings > Pages**, select **Deploy from a branch**, select `main` and `/ (root)`.
3. Wait for the deployment to finish and visit the Pages URL.

**Privacy warning:** GitHub Pages is publicly accessible. Only upload files approved for publication. The supplied ZIP included student research reports; make sure their authors approve public hosting before publishing.

## Add, replace or remove files

Put the files in `assets/files/`, and edit `assets/manifest.json`. Each object has:

```json
{
  "id": "file-09",
  "name": "Progress Presentation 1.pptx",
  "category": "Progress",
  "type": "Presentation",
  "format": "PPTX",
  "size": 1234567,
  "path": "assets/files/progress-1.pptx"
}
```

Accepted categories: `Proposal`, `Progress`, `Research Paper`, `Other`. Types: `Document`, `Presentation`, `Spreadsheet`. File templates are recognized by `Template` in the name, or `.potm` format. Uploading directly through the website requires an external backend, which is deliberately not included in this static version.

## Contents

Nine unique files, including the proposal reports and presentation, TAF, IME business plan, Progress Presentation 2, and IEEE research paper template. Empty placeholder folders and duplicate documents are not listed.
