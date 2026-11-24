import {
  diagnosticarCompatibilidadeProfissional
} from "./diagnosticoProfissional";

export function diagnosticarMultiplosCargos(
  cargoVaga: string,
  cargosDesejados: string
) {
  const cargos = [
    ...new Set(
      cargosDesejados
        .split(/[,;\n]/)
        .map((cargo) => cargo.trim())
        .filter(Boolean)
    )
  ];

  const ordem = {
    direta: 0,
    parcial: 1,
    nao_identificada: 2
  };

  return cargos
    .map((cargoDesejado) => ({
      cargoDesejado,
      ...diagnosticarCompatibilidadeProfissional(
        cargoVaga,
        cargoDesejado
      )
    }))
    .sort(
      (a, b) =>
        ordem[a.classificacaoAtual] -
        ordem[b.classificacaoAtual]
    );
}
