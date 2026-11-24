export type GrupoOportunidadeV2 =
  | "correspondencia_identificada"
  | "oportunidades_relacionadas"
  | "outras_oportunidades";

const ordemGrupos: Record<GrupoOportunidadeV2, number> = {
  correspondencia_identificada: 0,
  oportunidades_relacionadas: 1,
  outras_oportunidades: 2
};

export function ordenarOportunidadesV2<
  T extends { grupoOportunidade: GrupoOportunidadeV2 }
>(vagas: readonly T[]): T[] {
  return vagas
    .map((vaga, indice) => ({ vaga, indice }))
    .sort(
      (a, b) =>
        ordemGrupos[a.vaga.grupoOportunidade] -
          ordemGrupos[b.vaga.grupoOportunidade] ||
        a.indice - b.indice
    )
    .map(({ vaga }) => vaga);
}
