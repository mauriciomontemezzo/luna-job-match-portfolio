export type RelacaoComplementarV3 =
  | "parcial"
  | "nao_identificada";

const relacoesParciais = [
  ["backend developer", "software engineer"],
  ["machine learning engineer", "ai engineer"]
] as const;

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function verificarRelacaoComplementarV3(
  cargoVaga: string,
  cargoDesejado: string
): RelacaoComplementarV3 {
  const vaga = normalizar(cargoVaga);
  const desejado = normalizar(cargoDesejado);

  if (!vaga || !desejado) {
    return "nao_identificada";
  }

  const corresponde = relacoesParciais.some(
    ([primeiro, segundo]) =>
      (vaga === primeiro && desejado === segundo) ||
      (vaga === segundo && desejado === primeiro)
  );

  return corresponde
    ? "parcial"
    : "nao_identificada";
}
