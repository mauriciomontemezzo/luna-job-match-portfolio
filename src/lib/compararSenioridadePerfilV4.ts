import {
  analisarSenioridade,
  type NivelSenioridade
} from "./analiseSenioridade";

import {
  analisarSenioridadePerfilV4
} from "./senioridadePerfilV4";

export type ResultadoComparacaoPerfilV4 = {
  situacao:
    | "indicio_correspondencia"
    | "possivel_diferenca"
    | "nao_confirmada";
  nivelVaga: NivelSenioridade;
  niveisHistorico: NivelSenioridade[];
  motivo: string;
  experimental: true;
  alteraPontuacao: false;
  alteraPrioridade: false;
};

export function compararSenioridadePerfilV4(
  cargoVaga: string,
  experiencias: unknown[]
): ResultadoComparacaoPerfilV4 {
  const vaga = analisarSenioridade(cargoVaga);
  const perfil = analisarSenioridadePerfilV4(experiencias);

  const base = {
    nivelVaga: vaga.nivel,
    niveisHistorico: perfil.niveisIdentificados,
    experimental: true as const,
    alteraPontuacao: false as const,
    alteraPrioridade: false as const
  };

  if (
    vaga.nivel === "nao_identificada" ||
    perfil.niveisIdentificados.length !== 1
  ) {
    return {
      ...base,
      situacao: "nao_confirmada",
      motivo:
        "Informacoes insuficientes ou diferentes niveis no historico."
    };
  }

  const nivelPerfil = perfil.niveisIdentificados[0];

  if (nivelPerfil === vaga.nivel) {
    return {
      ...base,
      situacao: "indicio_correspondencia",
      motivo:
        "O historico apresenta indicador de senioridade correspondente ao da vaga. A qualificacao ainda precisa ser verificada."
    };
  }

  return {
    ...base,
    situacao: "possivel_diferenca",
    motivo:
      "O nivel identificado no historico difere do nivel indicado na vaga. Isso nao comprova incompatibilidade."
  };
}
