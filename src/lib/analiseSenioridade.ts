export type NivelSenioridade =
  | "junior"
  | "pleno"
  | "senior"
  | "lideranca"
  | "nao_identificada";

export type AnaliseSenioridade = {
  nivel: NivelSenioridade;
  motivo: string;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function analisarSenioridade(
  cargo: string
): AnaliseSenioridade {
  const texto = normalizar(cargo);

  if (
    /\b(tech lead|team lead|engineering manager|head of|director of|vp of|cto)\b/.test(texto)
  ) {
    return {
      nivel: "lideranca",
      motivo: "Indicador de lideranca identificado no cargo."
    };
  }

  if (
    /\b(senior|sr\.?|staff|principal)\b/.test(texto)
  ) {
    return {
      nivel: "senior",
      motivo: "Indicador de senioridade elevada identificado."
    };
  }

  if (
    /\b(mid.level|mid level|intermediate|pleno)\b/.test(texto)
  ) {
    return {
      nivel: "pleno",
      motivo: "Indicador de nivel pleno identificado."
    };
  }

  if (
    /\b(junior|jr\.?|entry.level|entry level|trainee)\b/.test(texto)
  ) {
    return {
      nivel: "junior",
      motivo: "Indicador de nivel inicial identificado."
    };
  }

  return {
    nivel: "nao_identificada",
    motivo: "Senioridade nao identificada no titulo."
  };
}
