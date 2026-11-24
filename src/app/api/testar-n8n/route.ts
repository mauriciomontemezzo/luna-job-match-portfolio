export async function POST() {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { ok: false, mensagem: "Rota indisponivel." },
      { status: 404 }
    );
  }

  const token = process.env.LUNA_N8N_UPLOAD_TOKEN;

  if (!token) {
    return Response.json(
      { ok: false, mensagem: "Chave ausente." },
      { status: 503 }
    );
  }

  try {
    const resposta = await fetch(
      "http://127.0.0.1:5678/webhook/luna-web-v1-upload-test",
      {
        method: "POST",
        headers: {
          "x-luna-api-key": token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "tipo=teste",
        cache: "no-store",
        signal: AbortSignal.timeout(8000)
      }
    );

    if (!resposta.ok) {
      return Response.json(
        { ok: false, statusN8n: resposta.status },
        { status: 502 }
      );
    }

    const dados = await resposta.json();

    if (dados.ok !== true || dados.tipo !== "upload-teste") {
      throw new Error("Resposta inesperada");
    }

    return Response.json({
      ok: true,
      conexao: "Next.js + n8n",
      autenticado: true,
      processado: false,
      mensagem: "Conexao autenticada funcionando!"
    });
  } catch {
    return Response.json(
      { ok: false, mensagem: "Falha de comunicacao." },
      { status: 502 }
    );
  }
}
