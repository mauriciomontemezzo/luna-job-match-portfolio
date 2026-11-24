type Registro = Record<string, unknown>;

function objeto(valor: unknown): valor is Registro {
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

  if (
    !request.headers.get("content-type")
      ?.startsWith("application/json")
  ) {
    return Response.json(
      { ok: false, mensagem: "Envie JSON." },
      { status: 415 }
    );
  }

  let entrada: Registro;

  try {
    const tamanho = Number(
      request.headers.get("content-length") || 0
    );

    if (tamanho > 131072) {
      return Response.json(
        { ok: false, mensagem: "Dados muito grandes." },
        { status: 413 }
      );
    }

    const texto = await request.text();

    if (new TextEncoder().encode(texto).length > 131072) {
      return Response.json(
        { ok: false, mensagem: "Dados muito grandes." },
        { status: 413 }
      );
    }

    const dados: unknown = JSON.parse(texto);

    if (
      !objeto(dados) ||
      !objeto(dados.perfil) ||
      !objeto(dados.preferencias) ||
      typeof dados.perfil.resumo !== "string" ||
      !dados.perfil.resumo.trim() ||
      typeof dados.preferencias.cargos !== "string" ||
      !dados.preferencias.cargos.trim()
    ) {
      return Response.json(
        { ok: false, mensagem: "Perfil invalido." },
        { status: 400 }
      );
    }

    entrada = dados;
  } catch {
    return Response.json(
      { ok: false, mensagem: "JSON invalido." },
      { status: 400 }
    );
  }

  try {
    const resposta = await fetch(
      "http://127.0.0.1:5678/webhook-test/luna-jobmatch-simulador-v1-teste",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          perfil: entrada.perfil,
          preferencias: entrada.preferencias
        }),
        cache: "no-store",
        signal: AbortSignal.timeout(25000)
      }
    );

    if (!resposta.ok) {
      throw new Error("Falha HTTP no n8n.");
    }

    const resultado: unknown = await resposta.json();

    if (
      !objeto(resultado) ||
      resultado.ok !== true ||
      resultado.classificacaoExecutada !== true ||
      resultado.vagasSimuladas !== true ||
      resultado.buscaExecutada !== false ||
      !Array.isArray(resultado.vagasClassificadas) ||
      resultado.vagasClassificadas.length !== 5
    ) {
      throw new Error("Resposta inesperada do simulador.");
    }

    const vagas = resultado.vagasClassificadas;

    if (!vagas.every(v =>
      objeto(v) &&
      typeof v.cargo === "string" &&
      typeof v.empresa === "string" &&
      typeof v.pontuacao === "number" &&
      Number.isFinite(v.pontuacao) &&
      v.pontuacao >= 0 &&
      v.pontuacao <= 100 &&
      ["alta", "media", "baixa"].includes(
        String(v.prioridade)
      ) &&
      Array.isArray(v.motivos) &&
      Array.isArray(v.pendencias)
    )) {
      throw new Error("Vagas retornadas invalidas.");
    }

    return Response.json({
      ok: true,
      servico: "LUNA Job Match",
      etapa: "dashboard-simulado",
      vagasSimuladas: true,
      buscaExecutada: false,
      totalVagas: vagas.length,
      vagasClassificadas: vagas,
      mensagem:
        "Cinco vagas ficticias classificadas."
    });

  } catch {
    return Response.json(
      {
        ok: false,
        buscaExecutada: false,
        mensagem:
          "Falha na comunicacao com o simulador."
      },
      { status: 502 }
    );
  }
}
