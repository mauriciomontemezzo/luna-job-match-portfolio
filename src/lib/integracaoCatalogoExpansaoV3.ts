import {
  compararCatalogoExpansaoV3,
  type RelacaoCatalogoV3
} from "./compararCatalogoExpansaoV3";

export type ResultadoIntegracaoV3 = {
  classificacao: RelacaoCatalogoV3;
  origem: "original" | "catalogo_expansao";
};

export function integrarCatalogoExpansaoV3(
  cargoVaga: string,
  cargoDesejado: string,
  classificacaoOriginal: RelacaoCatalogoV3
): ResultadoIntegracaoV3 {
  if (classificacaoOriginal === "direta") {
    return {
      classificacao: "direta",
      origem: "original"
    };
  }

  if (classificacaoOriginal === "parcial") {
    return {
      classificacao: "parcial",
      origem: "original"
    };
  }

  const expansao = compararCatalogoExpansaoV3(
    cargoVaga,
    cargoDesejado
  );

  if (expansao === "nao_identificada") {
    return {
      classificacao: classificacaoOriginal,
      origem: "original"
    };
  }

  return {
    classificacao: expansao,
    origem: "catalogo_expansao"
  };
}
