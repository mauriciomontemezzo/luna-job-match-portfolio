const LIMITE = 10 * 1024 * 1024;

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { ok: false, mensagem: "Rota indisponivel." },
      { status: 404 }
    );
  }

  const token = process.env.LUNA_N8N_UPLOAD_TOKEN;

  if (!token) {
    return Response.json(
      { ok: false, mensagem: "Chave nao configurada." },
      { status: 503 }
    );
  }

  const tamanho = Number(
    request.headers.get("content-length") || 0
  );

  if (tamanho > LIMITE + 1024 * 1024) {
    return Response.json(
      { ok: false, mensagem: "Requisicao muito grande." },
      { status: 413 }
    );
  }

  try {
    const formulario = await request.formData();
    const arquivo = formulario.get("curriculo");

    if (!(arquivo instanceof File)) {
      return Response.json(
        { ok: false, mensagem: "PDF nao encontrado." },
        { status: 400 }
      );
    }

    if (arquivo.size === 0 || arquivo.size > LIMITE) {
      return Response.json(
        { ok: false, mensagem: "Tamanho invalido." },
        { status: 413 }
      );
    }

    if (
      !arquivo.name.toLowerCase().endsWith(".pdf") ||
      arquivo.type !== "application/pdf"
    ) {
      return Response.json(
        { ok: false, mensagem: "Formato invalido." },
        { status: 415 }
      );
    }

    const assinatura = new TextDecoder().decode(
      await arquivo.slice(0, 5).arrayBuffer()
    );

    if (assinatura !== "%PDF-") {
      return Response.json(
        { ok: false, mensagem: "Assinatura invalida." },
        { status: 415 }
      );
    }

    const envio = new FormData();
    envio.append("arquivo", arquivo, arquivo.name);

    const resposta = await fetch(
      "http://127.0.0.1:5678/webhook/luna-web-v3-arquivo-teste",
      {
        method: "POST",
        headers: {
          "x-luna-api-key": token
        },
        body: envio,
        cache: "no-store",
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!resposta.ok) {
      throw new Error("Falha HTTP no n8n");
    }

    const dados = await resposta.json();

    if (
      dados.ok !== true ||
      dados.recebido !== true ||
      dados.processado !== false
    ) {
      throw new Error("Resposta inesperada do n8n");
    }

    return Response.json({
      ok: true,
      recebidoPeloN8n: true,
      nomeArquivo: dados.nomeArquivo,
      processado: false,
      mensagem: "PDF entregue ao n8n com sucesso!"
    });

  } catch {
    return Response.json(
      {
        ok: false,
        mensagem: "Falha no envio ao n8n."
      },
      { status: 502 }
    );
  }
}
