import {
  diagnosticarMultiplosCargos
} from "./diagnosticoMultiplosCargos";

export type GrupoOportunidade =
  | "correspondencia_identificada"
  | "oportunidades_relacionadas"
  | "outras_oportunidades";

export function classificarOportunidade(
  cargoVaga: string,
  cargosDesejados: string
): GrupoOportunidade {
  const diagnosticos = diagnosticarMultiplosCargos(
    cargoVaga,
    cargosDesejados
  );

  if (
    diagnosticos.some(
      (item) => item.classificacaoAtual === "direta"
    )
  ) {
    return "correspondencia_identificada";
  }

  if (
    diagnosticos.some(
      (item) => item.classificacaoAtual === "parcial"
    )
  ) {
    return "oportunidades_relacionadas";
  }

  return "outras_oportunidades";
}
