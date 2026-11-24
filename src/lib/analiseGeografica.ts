export type SituacaoGeografica =
  | "brasil_mencionado"
  | "regiao_compativel"
  | "global"
  | "restricao_identificada"
  | "localizacao_limitada"
  | "nao_confirmada";

export type AnaliseGeografica = {
  situacao: SituacaoGeografica;
  motivo: string;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

export function analisarGeografia(
  localizacao: string
): AnaliseGeografica {
  const texto = normalizar(localizacao);

  if (!texto) {
    return {
      situacao: "nao_confirmada",
      motivo: "Localizacao nao informada."
    };
  }

  const restricoes = [
    /\busa only\b/,
    /\bus only\b/,
    /\bus residents only\b/,
    /\bcanada only\b/,
    /\buk only\b/,
    /\beu only\b/,
    /\bunited states only\b/,
    /\bmust be based in (the )?(usa|us|united states|canada|uk)\b/
  ];

  if (restricoes.some(regra => regra.test(texto))) {
    return {
      situacao: "restricao_identificada",
      motivo: "Restricao geografica explicita identificada."
    };
  }

  if (/\b(brazil|brasil)\b/.test(texto)) {
    return {
      situacao: "brasil_mencionado",
      motivo: "Brasil mencionado na localizacao da vaga."
    };
  }

  if (
    /\b(latam|latin america|south america|america latina)\b/.test(texto)
  ) {
    return {
      situacao: "regiao_compativel",
      motivo: "Regiao que inclui o Brasil mencionada."
    };
  }

  if (
    /\b(worldwide|anywhere|global|work from anywhere)\b/.test(texto)
  ) {
    return {
      situacao: "global",
      motivo: "Vaga anunciada como global. Confirmar restricoes."
    };
  }

  if (
    /\b(usa|united states|canada|uk|united kingdom)\b/.test(texto) ||
    /\b(us timezones|usa timezones)\b/.test(texto)
  ) {
    return {
      situacao: "localizacao_limitada",
      motivo: "Paises ou fusos especificos mencionados. Verificar elegibilidade."
    };
  }

  return {
    situacao: "nao_confirmada",
    motivo: "Elegibilidade para o Brasil nao confirmada."
  };
}
