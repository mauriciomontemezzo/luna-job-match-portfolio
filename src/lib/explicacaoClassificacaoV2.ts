import { classificarOportunidadeV2 } from "./classificacaoOportunidadesV2";

export type ExplicacaoClassificacaoV2 = {
  classificacao: ReturnType<typeof classificarOportunidadeV2>;
  evidencias: string[];
  limitacoes: string[];
  experimental: true;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function explicarClassificacaoV2(
  cargoVaga: string,
  cargosDesejados: string,
  competenciasMencionadas: string[] = []
): ExplicacaoClassificacaoV2 {
  const classificacao = classificarOportunidadeV2(
    cargoVaga,
    cargosDesejados,
    competenciasMencionadas
  );

  const evidencias: string[] = [];
  const limitacoes: string[] = [];

  const titulo = normalizar(cargoVaga);
  const tecnologias = competenciasMencionadas.map(normalizar);

  if (tecnologias.includes("python")) {
    evidencias.push("Python mencionado no anuncio.");
  }

  if (
    /\b(back end|backend) (software )?(developer|engineer)\b/.test(titulo)
  ) {
    evidencias.push("Cargo relacionado a desenvolvimento backend.");
  }

  if (/\bdata engineer\b/.test(titulo)) {
    evidencias.push("Cargo relacionado a engenharia de dados.");
  }

  if (classificacao === "oportunidades_relacionadas") {
    limitacoes.push(
      "Relacao profissional nao confirma compatibilidade integral."
    );
  }

  limitacoes.push(
    "Requisitos obrigatorios e elegibilidade devem ser verificados."
  );

  return {
    classificacao,
    evidencias,
    limitacoes,
    experimental: true
  };
}
