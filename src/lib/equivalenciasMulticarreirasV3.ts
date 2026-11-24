import {
  equivalenciasDiretas,
  relacoesProfissionais
} from "./catalogoMulticarreirasV3";

import { verificarEquivalenciaCargo } from "./equivalenciasCargos";

export type RelacaoProfissionalV3 =
  | "direta"
  | "parcial"
  | "nao_identificada";

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function verificarRelacaoProfissionalV3(
  cargoVaga: string,
  cargoDesejado: string
): RelacaoProfissionalV3 {
  const original = verificarEquivalenciaCargo(
    cargoVaga,
    cargoDesejado
  );

  if (original === "direta" || original === "parcial") {
    return original;
  }

  const vaga = normalizar(cargoVaga);
  const desejado = normalizar(cargoDesejado);

  if (!vaga || !desejado) {
    return "nao_identificada";
  }

  const equivalentes = equivalenciasDiretas.some(
    (grupo) =>
      grupo.equivalentes.includes(vaga) &&
      grupo.equivalentes.includes(desejado)
  );

  if (equivalentes) {
    return "direta";
  }

  const relacionados = relacoesProfissionais.some(
    (grupo) =>
      grupo.cargos.includes(vaga) &&
      grupo.cargos.includes(desejado)
  );

  return relacionados ? "parcial" : "nao_identificada";
}
