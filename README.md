# Portfolio Chatbot — React + FastAPI

Asistente embebible para portfolio personal, diseñado para responder preguntas frecuentes (servicios, stack, proyectos y contacto) de forma clara y guiada.

> Nota: este chat es informativo y no envía mensajes automáticamente. Para contactarme, usa los datos de contacto que comparte el bot.

## Features
- UI en **React**
- Estado de carga **“Escribiendo…”**
- **Quick actions** (respuestas guiadas)
- **Autoscroll** al último mensaje
- Render de **links / emails** en las respuestas
- Textos configurables vía **FAQ** (keywords → replies)
- Estilos y branding personalizables

## Stack
**Frontend**
- React (componente embebible)

**Backend**
- Python + FastAPI
- Endpoint `/chat` con respuestas por intents (FAQ)

## Estructura
frontend/ # UI (React)
backend/ # API (FastAPI)


## Getting Started

### 1) Backend (FastAPI)
```bash
cd backend
python -m venv .venv
# activar venv:
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload --port 8000
