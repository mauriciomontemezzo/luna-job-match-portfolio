import type { RelevanciaCargo } from "./compatibilidadeVagas";
import type { SituacaoGeografica } from "./analiseGeografica";
import type { SituacaoSenioridade } from "./compararSenioridade";

export type EntradaPontuacao = {
  relevanciaCargo: RelevanciaCargo;
  tecnologiasEncontradas: number;
  tecnologiasDesejadas: number;
  situacaoGeografica: SituacaoGeografica;
  situacaoSenioridade?: SituacaoSenioridade;
};

export type ResultadoPontuacao = {
  pontuacaoParcial: number;
  pontuacaoMaximaAvaliada: number;
  criteriosPendentes: string[];
  alertaGeografico: boolean;
  detalhes: {
    cargo: number;
    tecnologias: number | null;
    geografia: number | null;
    senioridade: number | null;
  };
};

export function calcularPontuacao(
  entrada: EntradaPontuacao
): ResultadoPontuacao {
  const cargo = {
    direta: 40,
    parcial: 20,
    nao_identificada: 0
  }[entrada.relevanciaCargo];

  const tecnologias =
    entrada.tecnologiasDesejadas > 0
      ? Math.round(
          30 *
          Math.min(
            1,
            Math.max(0, entrada.tecnologiasEncontradas) /
              entrada.tecnologiasDesejadas
          )
        )
      : null;

  const pontosGeografia: Partial<
    Record<SituacaoGeografica, number>
  > = {
    brasil_mencionado: 20,
    regiao_compativel: 15,
    global: 10,
    restricao_identificada: 0
  };

  const geografia =
    pontosGeografia[entrada.situacaoGeografica] ?? null;

  const senioridade =
    entrada.situacaoSenioridade === "correspondente"
      ? 10
      : entrada.situacaoSenioridade ===
          "possivel_incompatibilidade"
        ? 0
        : null;

  const pendentes: string[] = [];

  if (senioridade === null) {
    pendentes.push("Senioridade nao avaliada");
  }

  if (tecnologias === null) {
    pendentes.push("Tecnologias nao informadas");
  }

  if (geografia === null) {
    pendentes.push("Elegibilidade geografica nao confirmada");
  }

  return {
    pontuacaoParcial:
      cargo + (tecnologias ?? 0) +
      (geografia ?? 0) + (senioridade ?? 0),
    pontuacaoMaximaAvaliada:
      40 +
      (tecnologias === null ? 0 : 30) +
      (geografia === null ? 0 : 20) +
      (senioridade === null ? 0 : 10),
    criteriosPendentes: pendentes,
    alertaGeografico:
      entrada.situacaoGeografica === "restricao_identificada",
    detalhes: {
      cargo,
      tecnologias,
      geografia,
      senioridade
    }
  };
}
