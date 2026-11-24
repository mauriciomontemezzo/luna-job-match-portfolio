import {
  integrarCatalogoExpansaoV3
} from "./integracaoCatalogoExpansaoV3";

import type {
  RelacaoCatalogoV3
} from "./compararCatalogoExpansaoV3";

export type ResultadoIntegracaoSeguraV3 = {
  classificacao: RelacaoCatalogoV3;
  origem: "original" | "catalogo_expansao";
  revisaoSemantica: boolean;
};

export function integrarCatalogoSeguraV3(
  cargoVaga: string,
  cargoDesejado: string,
  classificacaoOriginal: RelacaoCatalogoV3
): ResultadoIntegracaoSeguraV3 {
  const resultado = integrarCatalogoExpansaoV3(
    cargoVaga,
    cargoDesejado,
    classificacaoOriginal
  );

  if (
    resultado.origem === "catalogo_expansao" &&
    resultado.classificacao === "direta"
  ) {
    return {
      classificacao: "parcial",
      origem: "catalogo_expansao",
      revisaoSemantica: true
    };
  }

  return {
    ...resultado,
    revisaoSemantica: false
  };
}
