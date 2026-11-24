function objeto(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    valor !== null &&
    typeof valor === "object" &&
    !Array.isArray(valor)
  );
}

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return Response.json(
      { ok: false, mensagem: "Rota indisponivel." },
      { status: 404 }
    );
  }

  const url = process.env.LUNA_N8N_BUSCA_REAL_V2_URL;

  if (!url) {
    return Response.json(
      { ok: false, mensagem: "Busca real nao configurada." },
      { status: 503 }
    );
  }

  if (
    !request.headers.get("content-type")
      ?.startsWith("application/json")
  ) {
    return Response.json(
      { ok: false, mensagem: "Envie JSON." },
      { status: 415 }
    );
  }

  let entrada: unknown;

  try {
    const tamanho = Number(
      request.headers.get("content-length") || 0
    );

    if (tamanho > 262144) {
      return Response.json(
        { ok: false, mensagem: "Dados muito grandes." },
        { status: 413 }
      );
    }

    const texto = await request.text();

    if (new TextEncoder().encode(texto).length > 262144) {
      return Response.json(
        { ok: false, mensagem: "Dados muito grandes." },
        { status: 413 }
      );
    }

    entrada = JSON.parse(texto);
  } catch {
    return Response.json(
      { ok: false, mensagem: "JSON invalido." },
      { status: 400 }
    );
  }

  if (
    !objeto(entrada) ||
    !objeto(entrada.perfil) ||
    !objeto(entrada.preferencias)
  ) {
    return Response.json(
      { ok: false, mensagem: "Dados incompletos." },
      { status: 400 }
    );
  }

  const perfil = entrada.perfil;
  const preferencias = entrada.preferencias;

  if (
    typeof perfil.resumo !== "string" ||
    !perfil.resumo.trim() ||
    typeof preferencias.cargos !== "string" ||
    !preferencias.cargos.trim()
  ) {
    return Response.json(
      { ok: false, mensagem: "Campos invalidos." },
      { status: 400 }
    );
  }

  try {
    const resposta = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        perfil,
        preferencias
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(60000)
    });

    if (!resposta.ok) {
      throw new Error("Falha HTTP no n8n.");
    }

    const recebido: unknown = await resposta.json();

    if (
      !objeto(recebido) ||
      recebido.ok !== true ||
      recebido.buscaExecutada !== true ||
      recebido.vagasSimuladas !== false ||
      !Array.isArray(recebido.vagas)
    ) {
      throw new Error("Resposta inesperada do n8n.");
    }

    const vagas = recebido.vagas;

    if (
      vagas.length > 100 ||
      !vagas.every(
        (vaga) =>
          objeto(vaga) &&
          typeof vaga.id === "string" &&
          typeof vaga.cargo === "string" &&
          typeof vaga.empresa === "string" &&
          typeof vaga.localizacao === "string" &&
          typeof vaga.linkCandidatura === "string" &&
          typeof vaga.fonte === "string" &&
          (
            vaga.competenciasMencionadas === undefined ||
            (
              Array.isArray(vaga.competenciasMencionadas) &&
              vaga.competenciasMencionadas.every(
                (item) => typeof item === "string"
              )
            )
          )
      )
    ) {
      throw new Error("Formato de vagas invalido.");
    }

    return Response.json({
      ok: true,
      servico: "LUNA Job Match V2 Experimental",
      etapa: "busca-real",
      n8nConfirmou: true,
      perfilRecebido: true,
      preferenciasRecebidas: true,
      cargoSolicitado: preferencias.cargos,
      buscaExecutada: true,
      vagasSimuladas: false,
      totalVagas: vagas.length,
      vagas,
      mensagem: "Busca real concluida."
    });
  } catch (erro) {
    console.error(
      "Falha na busca real:",
      erro instanceof Error ? erro.message : "Erro desconhecido"
    );

    return Response.json(
      {
        ok: false,
        n8nConfirmou: false,
        buscaExecutada: false,
        mensagem: "Falha na busca real de vagas."
      },
      { status: 502 }
    );
  }
}
