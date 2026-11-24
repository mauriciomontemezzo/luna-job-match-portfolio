import type { RelevanciaCargo } from "./compatibilidadeVagas";

export type VagaOrdenavel = {
  analise: {
    relevancia: RelevanciaCargo;
  };
  tecnologias: {
    totalEncontradas: number;
  };
};

const prioridades: Record<RelevanciaCargo, number> = {
  direta: 3,
  parcial: 2,
  nao_identificada: 1
};

export function ordenarVagas<T extends VagaOrdenavel>(
  vagas: T[]
): T[] {
  return [...vagas].sort((a, b) => {
    const diferencaCargo =
      prioridades[b.analise.relevancia] -
      prioridades[a.analise.relevancia];

    if (diferencaCargo !== 0) {
      return diferencaCargo;
    }

    return (
      b.tecnologias.totalEncontradas -
      a.tecnologias.totalEncontradas
    );
  });
}
