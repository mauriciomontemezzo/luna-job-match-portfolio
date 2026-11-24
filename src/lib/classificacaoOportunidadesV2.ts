import {
  classificarOportunidade,
  type GrupoOportunidade
} from "./classificacaoOportunidades";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function separarCargos(texto: string): string[] {
  return texto
    .split(/[,;\n]/)
    .map(normalizar)
    .filter(Boolean);
}

export function classificarOportunidadeV2(
  cargoVaga: string,
  cargosDesejados: string,
  competenciasMencionadas: string[] = []
): GrupoOportunidade {

  const original = classificarOportunidade(
    cargoVaga,
    cargosDesejados
  );

  if (original === "correspondencia_identificada") {
    return original;
  }

  const titulo = normalizar(cargoVaga);
  const desejados = separarCargos(cargosDesejados);

  const procuraPython = desejados.some(
    (cargo) =>
      cargo === "python developer" ||
      cargo === "desenvolvedor python" ||
      cargo === "desenvolvedora python"
  );

  if (!procuraPython) {
    return original;
  }

  // Equivalencia direta especifica.
  if (/^python (software )?engineer$/.test(titulo)) {
    return "correspondencia_identificada";
  }

  if (original === "oportunidades_relacionadas") {
    return original;
  }

  const tecnologias = new Set(
    competenciasMencionadas.map(normalizar)
  );

  if (!tecnologias.has("python")) {
    return original;
  }

  // Python mencionado + funcao profissional relacionada.
  // Isto nao confirma requisitos nem elegibilidade.
  const backend =
    /\b(back end|backend) (software )?(developer|engineer)\b/
      .test(titulo);

  const engenhariaDados =
    /\bdata engineer\b/.test(titulo);

  if (backend || engenhariaDados) {
    return "oportunidades_relacionadas";
  }

  return original;
}
