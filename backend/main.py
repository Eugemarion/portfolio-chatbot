from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# ✅ CORS para React en localhost:3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

@app.get("/")
def read_root():
    return {"message": "Hola Euge, tu asistente está vivo 🧠✨", "demo": True}

def normalize(text: str) -> str:
    return " ".join(text.lower().strip().split())

FAQ = {
    "colaborar": {
        "keywords": [
            "trabajemos", "trabajamos", "colaborar", "colaboración",
            "propuesta", "proyecto", "juntos", "juntas", "contratar"
        ],
        "reply": (
            "¡Genial! Para trabajar en conjunto, lo ideal es que me compartas:\n\n"
            "1) qué necesitás (landing, sitio, app, rediseño, etc.)\n"
            "2) deadline aproximado\n"
            "3) si ya tenés contenido o branding\n\n"
            "Con esa info te propongo el mejor enfoque.\n\n"
            "Contacto directo:\n"
            "📩 Email: contacto@eugeniamarion.com\n"
            "💬 WhatsApp: https://wa.me/543412661747\n"
            "🔗 LinkedIn: https://linkedin.com/in/euge-marion/"
        ),
    },

    "servicios": {
        "keywords": [
            "servicios", "ofreces", "ofrecés",
            "que haces", "qué hacés", "trabajas", "trabajás"
        ],
        "reply": (
            "Te ayudo a convertir una idea en un sitio o producto que funcione y se vea profesional.\n\n"
            "Servicios:\n"
            "• desarrollo web full-stack\n"
            "• diseño y maquetación\n"
            "• optimización UX\n"
            "• integraciones\n"
            "• mejoras de performance\n\n"
            "Si me contás tu objetivo, te digo cuál es el mejor enfoque."
        ),
    },

    "stack": {
        "keywords": [
            "stack", "tecnologias", "tecnologías",
            "tech", "herramientas", "backend", "frontend"
        ],
        "reply": (
            "Stack de trabajo:\n\n"
            "• Frontend: React\n"
            "• Backend: .NET o Python (FastAPI), según el proyecto\n"
            "• Bases de datos: SQL y, cuando aplica, NoSQL\n\n"
            "Trabajo con foco en buenas prácticas, seguridad y performance."
        ),
    },

    "proyectos": {
        "keywords": [
            "proyectos", "portfolio", "portafolio",
            "repositorio", "github", "casos", "trabajos"
        ],
        "reply": (
            "Podés ver proyectos y casos en mi portfolio y repositorios.\n\n"
            "Si me decís qué te interesa (API, e-commerce, UI, integraciones, etc.), "
            "te guío al ejemplo más relevante."
        ),
    },

    "contacto": {
        "keywords": [
            "contacto", "contactarte", "email",
            "mail", "linkedin", "reunión", "reunion", "call"
        ],
        "reply": (
            "Contacto directo:\n\n"
            "📩 Email: contacto@eugeniamarion.com\n"
            "💬 WhatsApp: https://wa.me/543412661747\n"
            "🔗 LinkedIn: https://linkedin.com/in/euge-marion/\n\n"
            "Este chat es informativo y no envía mensajes."
        ),
    },

    "precio": {
        "keywords": [
            "precio", "presupuesto", "costo",
            "cuanto", "cuánto", "tarifa", "valor"
        ],
        "reply": (
            "El presupuesto depende del alcance del proyecto.\n\n"
            "Para orientarte mejor, podés decirme:\n"
            "• objetivo\n"
            "• cantidad de páginas o funcionalidades\n"
            "• integraciones necesarias\n"
            "• deadline aproximado\n\n"
            "Con eso te doy una estimación inicial."
        ),
    },
}

SUGGESTIONS = [
    "¿Qué servicios ofrecés?",
    "¿Cuál es tu stack?",
    "¿Dónde veo tus proyectos?",
    "¿Cómo puedo contactarte?",
]

@app.post("/chat")
def chat(req: ChatRequest):
    msg = normalize(req.message)

    for item in FAQ.values():
        if any(k in msg for k in item["keywords"]):
            return {"reply": item["reply"], "demo": True}

    return {
        "reply": (
            "Estoy en modo demo 😄. Puedo contarte sobre servicios, stack, proyectos o contacto. "
            "Probá con: " + " | ".join(SUGGESTIONS)
        ),
        "demo": True,
    }