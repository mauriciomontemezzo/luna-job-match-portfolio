import {
  catalogoExpansaoMulticarreirasV3
} from "./catalogoExpansaoMulticarreirasV3";

export type RelacaoCatalogoV3 =
  | "direta"
  | "parcial"
  | "nao_identificada";

function normalizarCargo(cargo: string): string {
  return cargo
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

export function compararCatalogoExpansaoV3(
  cargoA: string,
  cargoB: string
): RelacaoCatalogoV3 {
  const a = normalizarCargo(cargoA);
  const b = normalizarCargo(cargoB);

  if (!a || !b) {
    return "nao_identificada";
  }

  for (const familia of catalogoExpansaoMulticarreirasV3) {
    const cargos = familia.cargos.map(normalizarCargo);

    if (cargos.includes(a) && cargos.includes(b)) {
      return familia.tipo;
    }
  }

  return "nao_identificada";
}
