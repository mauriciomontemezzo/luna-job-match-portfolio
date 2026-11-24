export type PrioridadeVaga =
  | "alta"
  | "media"
  | "baixa"
  | "revisao_necessaria";

export type EntradaPrioridade = {
  pontuacaoParcial: number;
  pontuacaoMaximaAvaliada: number;
  criteriosPendentes: string[];
  alertaGeografico: boolean;
  incompatibilidadeSenioridade: boolean;
};

export type ResultadoPrioridade = {
  prioridade: PrioridadeVaga;
  motivo: string;
};

export function calcularPrioridade(
  entrada: EntradaPrioridade
): ResultadoPrioridade {
  const {
    pontuacaoParcial,
    pontuacaoMaximaAvaliada,
    criteriosPendentes,
    alertaGeografico,
    incompatibilidadeSenioridade
  } = entrada;

  if (alertaGeografico || incompatibilidadeSenioridade) {
    return {
      prioridade: "revisao_necessaria",
      motivo: "Existe um alerta que exige verificacao."
    };
  }

  if (
    !Number.isFinite(pontuacaoParcial) ||
    !Number.isFinite(pontuacaoMaximaAvaliada) ||
    pontuacaoMaximaAvaliada <= 0 ||
    pontuacaoParcial < 0 ||
    pontuacaoParcial > pontuacaoMaximaAvaliada
  ) {
    return {
      prioridade: "revisao_necessaria",
      motivo: "Pontuacao insuficiente ou invalida."
    };
  }

  const percentual =
    (pontuacaoParcial / pontuacaoMaximaAvaliada) * 100;

  if (criteriosPendentes.length > 0) {
    return {
      prioridade: "revisao_necessaria",
      motivo: "Existem criterios ainda nao avaliados."
    };
  }

  if (percentual >= 80) {
    return {
      prioridade: "alta",
      motivo: "Correspondencia elevada nos criterios avaliados."
    };
  }

  if (percentual >= 50) {
    return {
      prioridade: "media",
      motivo: "Correspondencia intermediaria nos criterios avaliados."
    };
  }

  return {
    prioridade: "baixa",
    motivo: "Correspondencia reduzida nos criterios avaliados."
  };
}
