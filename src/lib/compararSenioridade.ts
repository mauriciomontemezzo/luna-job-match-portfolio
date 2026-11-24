import type { NivelSenioridade } from "./analiseSenioridade";

export type SituacaoSenioridade =
  | "correspondente"
  | "possivel_incompatibilidade"
  | "nao_confirmada"
  | "sem_restricao";

export type ComparacaoSenioridade = {
  situacao: SituacaoSenioridade;
  motivo: string;
};

export function compararSenioridade(
  nivelVaga: NivelSenioridade,
  preferencia: string
): ComparacaoSenioridade {
  const desejado = preferencia.trim().toLowerCase();

  if (!desejado || desejado === "indiferente") {
    return {
      situacao: "sem_restricao",
      motivo: "Nenhuma restricao de senioridade informada."
    };
  }

  if (nivelVaga === "nao_identificada") {
    return {
      situacao: "nao_confirmada",
      motivo: "Nivel da vaga nao identificado no titulo."
    };
  }

  const niveis: Record<string, number> = {
    junior: 1,
    pleno: 2,
    senior: 3,
    lideranca: 4
  };

  const nivelDesejado = niveis[desejado];
  const nivelEncontrado = niveis[nivelVaga];

  if (nivelDesejado === undefined) {
    return {
      situacao: "nao_confirmada",
      motivo: "Preferencia de senioridade nao reconhecida."
    };
  }

  if (nivelDesejado === nivelEncontrado) {
    return {
      situacao: "correspondente",
      motivo: "Nivel da vaga corresponde ao nivel desejado."
    };
  }

  if (nivelEncontrado > nivelDesejado) {
    return {
      situacao: "possivel_incompatibilidade",
      motivo: "A vaga indica nivel superior ao desejado."
    };
  }

  return {
    situacao: "nao_confirmada",
    motivo: "A vaga indica nivel inferior ao desejado."
  };
}
