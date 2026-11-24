const LIMITE = 10 * 1024 * 1024;

const URL_N8N =
  "http://127.0.0.1:5678/webhook/luna-web-v6-analisar";

export async function POST(request: Request) {
  // A rota ainda e exclusiva para desenvolvimento local.
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

  let formulario: FormData;

  try {
    formulario = await request.formData();
  } catch {
    return Response.json(
      { ok: false, mensagem: "Formulario invalido." },
      { status: 400 }
    );
  }

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
      { ok: false, mensagem: "Assinatura PDF invalida." },
      { status: 415 }
    );
  }

  try {
    const envio = new FormData();

    envio.append("arquivo", arquivo, arquivo.name);

    const resposta = await fetch(URL_N8N, {
      method: "POST",
      headers: {
        "x-luna-api-key": token
      },
      body: envio,
      cache: "no-store",
      signal: AbortSignal.timeout(180000)
    });

    if (!resposta.ok) {
      console.error(
        "LUNA v6: erro HTTP do n8n:",
        resposta.status
      );

      return Response.json(
        {
          ok: false,
          mensagem: "Falha na analise pelo n8n."
        },
        { status: 502 }
      );
    }

    const dados: unknown = await resposta.json();

    if (
      !dados ||
      typeof dados !== "object" ||
      Array.isArray(dados)
    ) {
      throw new Error("Resposta invalida.");
    }

    const resultado = dados as Record<string, unknown>;

    if (
      resultado.ok !== true ||
      resultado.analiseGerada !== true ||
      !resultado.analise ||
      typeof resultado.analise !== "object" ||
      Array.isArray(resultado.analise)
    ) {
      throw new Error("Analise incompleta.");
    }

    return Response.json({
      ok: true,
      analiseGerada: true,
      revisaoPendente: resultado.revisaoPendente === true,
      analise: resultado.analise,
      mensagem: "Analise preliminar concluida."
    });

  } catch (erro) {
    const expirou =
      erro instanceof Error &&
      (erro.name === "TimeoutError" ||
       erro.name === "AbortError");

    return Response.json(
      {
        ok: false,
        mensagem: expirou
          ? "Tempo limite da analise excedido."
          : "Nao foi possivel concluir a analise."
      },
      { status: expirou ? 504 : 502 }
    );
  }
}
