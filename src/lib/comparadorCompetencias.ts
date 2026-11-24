export type SituacaoCompetencia =
  | "identificada"
  | "confirmacao_pendente"
  | "nao_identificada_no_perfil";

export type DiagnosticoCompetencia = {
  competencia: string;
  situacao: SituacaoCompetencia;
};

export type ResultadoCompetencias = {
  diagnosticos: DiagnosticoCompetencia[];
  totalRequisitos: number;
  identificadas: number;
  pendentes: number;
  naoIdentificadas: number;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extrairStrings(valores: unknown): string[] {
  if (!Array.isArray(valores)) return [];

  return valores
    .filter(
      (valor): valor is string =>
        typeof valor === "string"
    )
    .map(valor => valor.trim())
    .filter(Boolean);
}

export function compararCompetencias(
  requisitos: unknown,
  competenciasDeclaradas: unknown,
  competenciasAConfirmar: unknown
): ResultadoCompetencias {
  const declaradas = new Set(
    extrairStrings(competenciasDeclaradas)
      .map(normalizar)
  );

  const confirmar = new Set(
    extrairStrings(competenciasAConfirmar)
      .map(normalizar)
  );

  const requisitosUnicos = [
    ...new Map(
      extrairStrings(requisitos).map(item => [
        normalizar(item),
        item
      ])
    ).values()
  ];

  const diagnosticos = requisitosUnicos.map(
    competencia => {
      const chave = normalizar(competencia);

      const situacao: SituacaoCompetencia =
        declaradas.has(chave)
          ? "identificada"
          : confirmar.has(chave)
            ? "confirmacao_pendente"
            : "nao_identificada_no_perfil";

      return {
        competencia,
        situacao
      };
    }
  );

  return {
    diagnosticos,
    totalRequisitos: diagnosticos.length,
    identificadas: diagnosticos.filter(
      item => item.situacao === "identificada"
    ).length,
    pendentes: diagnosticos.filter(
      item =>
        item.situacao === "confirmacao_pendente"
    ).length,
    naoIdentificadas: diagnosticos.filter(
      item =>
        item.situacao ===
        "nao_identificada_no_perfil"
    ).length
  };
}
