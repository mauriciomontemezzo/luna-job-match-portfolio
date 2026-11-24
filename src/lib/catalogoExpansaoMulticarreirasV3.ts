export type FamiliaProfissionalV3 = {
  area: string;
  tipo: "direta" | "parcial";
  cargos: readonly string[];
};

export const catalogoExpansaoMulticarreirasV3:
  readonly FamiliaProfissionalV3[] = [
  {
    area: "educacao",
    tipo: "direta",
    cargos: [
      "english tutor",
      "english language tutor",
      "english language instructor"
    ]
  },
  {
    area: "administracao",
    tipo: "parcial",
    cargos: [
      "administrative assistant",
      "office assistant",
      "administrative coordinator"
    ]
  },
  {
    area: "atendimento",
    tipo: "parcial",
    cargos: [
      "customer support representative",
      "customer service representative",
      "customer care representative"
    ]
  },
  {
    area: "financas",
    tipo: "parcial",
    cargos: [
      "financial analyst",
      "finance analyst",
      "financial planning analyst"
    ]
  }
];
