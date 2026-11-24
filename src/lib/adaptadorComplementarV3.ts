import {
  adaptarDiagnosticoCombinadoV3
} from "./adaptadorCombinadoV3";

import {
  verificarRelacaoComplementarV3
} from "./relacoesComplementaresV3";

export function adaptarDiagnosticoComplementarV3(
  cargoVaga: string,
  cargosDesejados: string
) {
  const diagnosticos = adaptarDiagnosticoCombinadoV3(
    cargoVaga,
    cargosDesejados
  );

  return diagnosticos.map((diagnostico) => {
    if (
      diagnostico.classificacaoExpandida !==
      "nao_identificada"
    ) {
      return {
        ...diagnostico,
        origemComplementar: false,
        revisaoComplementar: false
      };
    }

    const complementar = verificarRelacaoComplementarV3(
      diagnostico.cargoVaga,
      diagnostico.cargoDesejado
    );

    if (complementar !== "parcial") {
      return {
        ...diagnostico,
        origemComplementar: false,
        revisaoComplementar: false
      };
    }

    return {
      ...diagnostico,
      classificacaoExpandida: "parcial" as const,
      origemComplementar: true,
      revisaoComplementar: true,
      alteraPontuacao: false as const,
      alteraPrioridade: false as const
    };
  });
}
