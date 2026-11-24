type GrupoProfissional = {
  equivalentes: readonly string[];
};

type RelacaoEntreCargos = {
  cargos: readonly string[];
};

export const equivalenciasDiretas: GrupoProfissional[] = [
  {
    equivalentes: [
      "english teacher",
      "esl instructor",
      "esl teacher",
      "professor de ingles"
    ]
  }
];

export const relacoesProfissionais: RelacaoEntreCargos[] = [
  {
    cargos: [
      "it support specialist",
      "help desk technician",
      "technical support specialist"
    ]
  },
  {
    cargos: [
      "ai automation developer",
      "ai workflow developer",
      "ai automation engineer"
    ]
  }
];
