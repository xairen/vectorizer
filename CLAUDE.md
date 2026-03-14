# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack text vectorization tool that converts text columns from CSV/Parquet files into BERT embeddings. React frontend with a Python Flask backend.

## Architecture

- **Frontend** (`Frontend/`): React 18 + Material-UI, served on `localhost:3000`
- **Backend** (`Backend/`): Flask + HuggingFace Transformers (bert-base-uncased), served on `localhost:5001`
- Communication via REST API with CORS enabled
- No database — uses in-memory storage via Flask global variables

**Data flow:** Upload file → select text column → POST to `/vectorize` → BERT tokenizes and encodes → vectors returned as JSON → preview in table → download as CSV

**API endpoints:**
- `POST /upload` — accepts CSV/Parquet, returns column names
- `POST /vectorize` — takes column data, returns BERT vectors
- `GET /download` — returns vectorized CSV

## Development Commands

### Backend
```bash
cd Backend
# activate venv (no requirements.txt exists — packages installed directly in venv)
source venv/bin/activate
python app.py
```

### Frontend
```bash
cd Frontend
npm start       # dev server
npm run build   # production build
npm test        # test runner
```

Both services must be running simultaneously for the app to work.

## Key Files

- `Backend/app.py` — entire backend (Flask routes + BERT vectorization logic)
- `Frontend/src/App.js` — main React component
- `Frontend/src/components/FileUpload.js` — file upload UI
- `Frontend/src/components/ColumnSelect.js` — column picker dropdown
- `Frontend/src/components/VectorDisplay.js` — vectorization trigger, preview table, and download

## Tech Stack

- **Frontend:** React 18, Material-UI 5, Axios, Emotion
- **Backend:** Flask, flask-cors, pandas, HuggingFace transformers (BertTokenizer, BertModel)
