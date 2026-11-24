import {
  adaptarDiagnosticoV3
} from "./adaptadorDiagnosticoV3";

import {
  integrarCatalogoSeguraV3
} from "./integracaoCatalogoSeguraV3";

export function adaptarDiagnosticoCombinadoV3(
  cargoVaga: string,
  cargosDesejados: string
) {
  const diagnosticos = adaptarDiagnosticoV3(
    cargoVaga,
    cargosDesejados
  );

  return diagnosticos.map((diagnostico) => {
    const expansao = integrarCatalogoSeguraV3(
      diagnostico.cargoVaga,
      diagnostico.cargoDesejado,
      diagnostico.classificacao
    );

    return {
      ...diagnostico,
      classificacaoOriginal: diagnostico.classificacao,
      classificacaoExpandida: expansao.classificacao,
      origemExpansao: expansao.origem,
      revisaoSemantica: expansao.revisaoSemantica,
      alteraPontuacao: false as const,
      alteraPrioridade: false as const
    };
  });
}
