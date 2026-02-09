import { useEffect, useMemo, useRef, useState } from "react";

export default function Chat() {
  const THEME = {
    primary: "#319C93",
    secondary: "#4AC6BC",
    bg: "#E6E6E6",
    text: "#1F2933",
    border: "#cfd4d8",
    white: "#ffffff",
    muted: "#6b7280",
  };

  // ✅ API configurable (Vite -> VITE_API_URL, CRA -> REACT_APP_API_URL)
  const API_BASE =
    (typeof import.meta !== "undefined" && import.meta.env?.VITE_API_URL) ||
    process.env.REACT_APP_API_URL ||
    "http://localhost:8000";

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text:
        "Hola 👋 Soy el asistente del portfolio.\n" +
        "Puedo ayudarte con: servicios, stack, proyectos y contacto.\n" +
        "Elegí una opción o escribí tu consulta.",
    },
  ]);

  const QUICK_ACTIONS = useMemo(
    () => [
      { label: "Servicios", text: "¿qué servicios ofrecés?" },
      { label: "Stack", text: "¿cuál es tu stack?" },
      { label: "Proyectos", text: "¿dónde veo tus proyectos?" },
      { label: "Contacto", text: "¿cómo puedo contactarte?" },
      {
        label: "¿Trabajamos juntos?",
        text: "¿tenés alguna propuesta para que trabajemos en conjunto?",
      },
    ],
    []
  );

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const listRef = useRef(null);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, isLoading]);

  async function fetchWithTimeout(url, options = {}, timeoutMs = 12000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      return res;
    } finally {
      clearTimeout(id);
    }
  }

  async function sendMessage(forcedText) {
    if (isLoading) return;

    const textToSend = (forcedText ?? input).trim();
    if (!textToSend) return;

    const userMsg = { from: "user", text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    setIsLoading(true);
    setMessages((prev) => [...prev, { from: "bot", text: "Escribiendo…" }]);

    try {
      const res = await fetchWithTimeout(`${API_BASE}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!res.ok) throw new Error("HTTP error");

      const data = await res.json();

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = { from: "bot", text: data.reply };
        return next;
      });
    } catch (err) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          from: "bot",
          text: "Error de conexión 😅 (¿backend disponible?)",
        };
        return next;
      });
    } finally {
      setIsLoading(false);
    }
  }

  function renderWithLinks(text) {
    const lines = text.split("\n");

    const linkifyWord = (word, key) => {
      const trimmed = word.replace(/[),.!?;:]+$/, "");
      const trailing = word.slice(trimmed.length);

      const linkStyle = {
        color: "#0F3F3C",
        textDecoration: "underline",
        fontWeight: 500,
      };

      if (/^https?:\/\/\S+$/i.test(trimmed)) {
        return (
          <span key={key}>
            <a href={trimmed} target="_blank" rel="noreferrer" style={linkStyle}>
              {trimmed}
            </a>
            {trailing}
          </span>
        );
      }

      if (/^www\.\S+$/i.test(trimmed)) {
        const url = `https://${trimmed}`;
        return (
          <span key={key}>
            <a href={url} target="_blank" rel="noreferrer" style={linkStyle}>
              {trimmed}
            </a>
            {trailing}
          </span>
        );
      }

      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        return (
          <span key={key}>
            <a href={`mailto:${trimmed}`} style={linkStyle}>
              {trimmed}
            </a>
            {trailing}
          </span>
        );
      }

      return <span key={key}>{word}</span>;
    };

    return lines.map((line, lineIdx) => {
      const parts = line.split(/(\s+)/);
      return (
        <span key={`line-${lineIdx}`}>
          {parts.map((p, idx) => linkifyWord(p, `${lineIdx}-${idx}`))}
          {lineIdx < lines.length - 1 ? <br /> : null}
        </span>
      );
    });
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: "40px auto",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        color: THEME.text,
      }}
    >
      <div style={{ fontSize: 12, color: THEME.muted, marginBottom: 6 }}>
        Demo mode · respuestas guiadas
      </div>

      <div
        ref={listRef}
        style={{
          border: `1px solid ${THEME.border}`,
          padding: 16,
          height: 320,
          overflowY: "auto",
          background: THEME.bg,
          borderRadius: 16,
        }}
      >
        {messages.map((m, i) => (
          <div
            key={i}
            style={{ textAlign: m.from === "user" ? "right" : "left", margin: "10px 0" }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "10px 12px",
                borderRadius: 14,
                background: m.from === "user" ? THEME.primary : THEME.secondary,
                color: THEME.white,
                whiteSpace: "pre-line",
                opacity: m.text === "Escribiendo…" ? 0.75 : 1,
                maxWidth: "85%",
                lineHeight: 1.35,
                boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
              }}
            >
              {m.from === "bot" ? renderWithLinks(m.text) : m.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
        {QUICK_ACTIONS.map((a) => (
          <button
            key={a.label}
            onClick={() => sendMessage(a.text)}
            disabled={isLoading}
            style={{
              padding: "7px 11px",
              borderRadius: 999,
              border: `1px solid ${THEME.border}`,
              background: THEME.white,
              color: THEME.text,
              cursor: isLoading ? "not-allowed" : "pointer",
              fontSize: 12,
              opacity: isLoading ? 0.6 : 1,
              transition: "all 120ms ease",
            }}
            onMouseEnter={(e) => {
              if (isLoading) return;
              e.currentTarget.style.background = THEME.primary;
              e.currentTarget.style.color = THEME.white;
              e.currentTarget.style.borderColor = THEME.primary;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = THEME.white;
              e.currentTarget.style.color = THEME.text;
              e.currentTarget.style.borderColor = THEME.border;
            }}
          >
            {a.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", marginTop: 10 }}>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Escribí tu pregunta…"
          disabled={isLoading}
          rows={2}
          style={{
            flex: 1,
            padding: 10,
            resize: "none",
            borderRadius: 12,
            border: `1px solid ${THEME.border}`,
            outline: "none",
            color: THEME.text,
            background: THEME.white,
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 3px rgba(49,156,147,0.25)";
            e.currentTarget.style.borderColor = THEME.primary;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "none";
            e.currentTarget.style.borderColor = THEME.border;
          }}
        />

        <button
          onClick={() => sendMessage()}
          disabled={isLoading}
          style={{
            marginLeft: 8,
            padding: "0 14px",
            borderRadius: 12,
            border: "none",
            background: THEME.primary,
            color: THEME.white,
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
            transition: "all 120ms ease",
          }}
          onMouseEnter={(e) => {
            if (isLoading) return;
            e.currentTarget.style.filter = "brightness(0.95)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.filter = "none";
          }}
        >
          {isLoading ? "..." : "Enviar"}
        </button>
      </div>
    </div>
  );
}