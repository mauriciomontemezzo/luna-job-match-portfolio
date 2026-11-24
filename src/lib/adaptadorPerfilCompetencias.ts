export type PerfilCompetencias = {
  competenciasDeclaradas: string[];
  competenciasAConfirmar: string[];
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

function extrairLista(valor: unknown): string[] {
  if (!Array.isArray(valor)) return [];

  const vistos = new Set<string>();
  const resultado: string[] = [];

  for (const item of valor) {
    if (typeof item !== "string") continue;

    const texto = item.trim();
    const chave = texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/\s+/g, " ");

    if (!chave || vistos.has(chave)) continue;

    vistos.add(chave);
    resultado.push(texto);
  }

  return resultado;
}

export function adaptarPerfilCompetencias(
  perfil: unknown
): PerfilCompetencias {
  if (!objeto(perfil)) {
    return {
      competenciasDeclaradas: [],
      competenciasAConfirmar: []
    };
  }

  return {
    competenciasDeclaradas: extrairLista(
      perfil.competenciasDeclaradas
    ),
    competenciasAConfirmar: extrairLista(
      perfil.competenciasAConfirmar
    )
  };
}
