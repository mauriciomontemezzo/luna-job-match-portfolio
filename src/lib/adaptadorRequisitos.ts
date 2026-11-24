export type OrigemRequisitos =
  | "estruturados"
  | "indisponiveis";

export type ResultadoRequisitos = {
  origem: OrigemRequisitos;
  disponivel: boolean;
  requisitos: string[];
};

function objeto(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function normalizar(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function adaptarRequisitos(
  vaga: unknown
): ResultadoRequisitos {
  if (!objeto(vaga)) {
    return {
      origem: "indisponiveis",
      disponivel: false,
      requisitos: []
    };
  }

  if (!Array.isArray(vaga.requisitos)) {
    return {
      origem: "indisponiveis",
      disponivel: false,
      requisitos: []
    };
  }

  const vistos = new Set<string>();
  const requisitos: string[] = [];

  for (const item of vaga.requisitos) {
    if (typeof item !== "string") continue;

    const requisito = item.trim();
    const chave = normalizar(requisito);

    if (!chave || vistos.has(chave)) continue;

    vistos.add(chave);
    requisitos.push(requisito);
  }

  return {
    origem: "estruturados",
    disponivel: true,
    requisitos
  };
}
