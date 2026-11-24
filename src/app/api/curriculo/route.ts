const LIMITE_BYTES = 10 * 1024 * 1024;


export async function POST(request: Request) {
  try {
    const tamanhoRequisicao = Number(
      request.headers.get("content-length") || 0
    );

    if (tamanhoRequisicao > LIMITE_BYTES + 1024 * 1024) {
      return Response.json(
        { ok: false, mensagem: "Requisicao muito grande." },
        { status: 413 }
      );
    }

    const formulario = await request.formData();
    const arquivo = formulario.get("curriculo");

    if (!(arquivo instanceof File)) {
      return Response.json(
        { ok: false, mensagem: "PDF nao encontrado." },
        { status: 400 }
      );
    }

    if (
      !arquivo.name.toLowerCase().endsWith(".pdf") ||
      (arquivo.type && arquivo.type !== "application/pdf")
    ) {
      return Response.json(
        { ok: false, mensagem: "Formato nao permitido." },
        { status: 415 }
      );
    }

    if (arquivo.size === 0 || arquivo.size > LIMITE_BYTES) {
      return Response.json(
        { ok: false, mensagem: "Arquivo vazio ou acima de 10 MB." },
        { status: 413 }
      );
    }

    const inicio = new TextDecoder().decode(
      await arquivo.slice(0, 5).arrayBuffer()
    );

    if (inicio !== "%PDF-") {
      return Response.json(
        { ok: false, mensagem: "Assinatura PDF invalida." },
        { status: 415 }
      );
    }

    return Response.json({
      ok: true,
      recebido: true,
      nomeArquivo: arquivo.name,
      tamanhoBytes: arquivo.size,
      mensagem: "PDF recebido para teste.",
      enviadoAoN8n: false
    });
  } catch {
    return Response.json(
      { ok: false, mensagem: "Falha ao processar o envio." },
      { status: 400 }
    );
  }
}
