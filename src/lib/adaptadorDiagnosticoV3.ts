import {
  verificarRelacaoProfissionalV3,
  type RelacaoProfissionalV3
} from "./equivalenciasMulticarreirasV3";

export type DiagnosticoAdaptadoV3 = {
  cargoVaga: string;
  cargoDesejado: string;
  classificacao: RelacaoProfissionalV3;
  origem: "equivalencias_v3";
  experimental: true;
  alteraPontuacao: false;
  alteraPrioridade: false;
};

export function adaptarDiagnosticoV3(
  cargoVaga: string,
  cargosDesejados: string
): DiagnosticoAdaptadoV3[] {
  const cargos = [
    ...new Set(
      cargosDesejados
        .split(/[,;\n]/)
        .map((cargo) => cargo.trim())
        .filter(Boolean)
    )
  ];

  return cargos.map((cargoDesejado) => ({
    cargoVaga,
    cargoDesejado,
    classificacao: verificarRelacaoProfissionalV3(
      cargoVaga,
      cargoDesejado
    ),
    origem: "equivalencias_v3" as const,
    experimental: true as const,
    alteraPontuacao: false as const,
    alteraPrioridade: false as const
  }));
}
