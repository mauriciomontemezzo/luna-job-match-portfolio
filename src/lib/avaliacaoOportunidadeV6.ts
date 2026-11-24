import type {
  DiagnosticoElegibilidadeV5
} from "./diagnosticoElegibilidadeV5";

export type SituacaoOportunidadeV6 =
  | "indicios_favoraveis"
  | "verificacao_necessaria"
  | "alertas_relevantes";

export type AvaliacaoOportunidadeV6 = {
  situacao: SituacaoOportunidadeV6;
  motivos: string[];
  experimental: true;
  elegibilidadeConfirmada: false;
  alteraPontuacao: false;
  alteraPrioridade: false;
  alteraClassificacao: false;
  alteraOrdenacao: false;
};

export function avaliarOportunidadeV6(
  diagnostico: DiagnosticoElegibilidadeV5
): AvaliacaoOportunidadeV6 {
  const motivos: string[] = [];

  const base = {
    experimental: true as const,
    elegibilidadeConfirmada: false as const,
    alteraPontuacao: false as const,
    alteraPrioridade: false as const,
    alteraClassificacao: false as const,
    alteraOrdenacao: false as const
  };

  const restricaoGeografica =
    diagnostico.situacaoGeografica ===
    "restricao_identificada";

  const diferencaSenioridade =
    diagnostico.situacaoSenioridade ===
    "possivel_diferenca";

  if (restricaoGeografica) {
    motivos.push(
      "Restricao geografica explicita identificada."
    );
  }

  if (diferencaSenioridade) {
    motivos.push(
      "Possivel diferenca de senioridade identificada."
    );
  }

  if (motivos.length > 0) {
    motivos.push(
      "Os alertas exigem verificacao, nao exclusao automatica."
    );

    return {
      ...base,
      situacao: "alertas_relevantes",
      motivos
    };
  }

  const correspondenciaDireta =
    diagnostico.relacaoProfissional === "direta";

  const senioridadeCorrespondente =
    diagnostico.situacaoSenioridade ===
    "indicio_correspondencia";

  const regiaoMencionada =
    diagnostico.situacaoGeografica ===
      "brasil_mencionado" ||
    diagnostico.situacaoGeografica ===
      "regiao_compativel";

  if (
    correspondenciaDireta &&
    senioridadeCorrespondente &&
    regiaoMencionada
  ) {
    motivos.push(
      "Indicadores favoraveis de cargo, senioridade e regiao."
    );

    motivos.push(
      "Requisitos obrigatorios e elegibilidade ainda precisam ser confirmados."
    );

    return {
      ...base,
      situacao: "indicios_favoraveis",
      motivos
    };
  }

  motivos.push(
    "Os indicadores disponiveis nao sao suficientes para uma avaliacao favoravel."
  );

  motivos.push(
    "Verificar requisitos, experiencia e condicoes geograficas."
  );

  return {
    ...base,
    situacao: "verificacao_necessaria",
    motivos
  };
}
