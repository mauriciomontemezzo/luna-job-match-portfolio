import { adaptarRequisitos } from "./adaptadorRequisitos";
import {
  compararCompetencias,
  type ResultadoCompetencias
} from "./comparadorCompetencias";

export type SituacaoDiagnosticoCompetencias =
  | "analisado"
  | "sem_requisitos"
  | "indisponivel";

export type DiagnosticoCompetencias = {
  situacao: SituacaoDiagnosticoCompetencias;
  resultado: ResultadoCompetencias | null;
  mensagem: string;
};

export function diagnosticarCompetencias(
  vaga: unknown,
  competenciasDeclaradas: unknown,
  competenciasAConfirmar: unknown
): DiagnosticoCompetencias {
  const adaptado = adaptarRequisitos(vaga);

  if (!adaptado.disponivel) {
    return {
      situacao: "indisponivel",
      resultado: null,
      mensagem:
        "A vaga nao fornece requisitos estruturados para analise."
    };
  }

  if (adaptado.requisitos.length === 0) {
    return {
      situacao: "sem_requisitos",
      resultado: null,
      mensagem:
        "Nenhum requisito analisavel foi informado na vaga."
    };
  }

  return {
    situacao: "analisado",
    resultado: compararCompetencias(
      adaptado.requisitos,
      competenciasDeclaradas,
      competenciasAConfirmar
    ),
    mensagem:
      "Comparacao realizada com os requisitos estruturados disponiveis."
  };
}
