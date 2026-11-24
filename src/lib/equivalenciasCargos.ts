export type EquivalenciaCargo =
  | "direta"
  | "parcial"
  | "nao_identificada";

type FamiliaCargo = {
  equivalentes: string[];
  relacionados?: string[];
};

const familias: FamiliaCargo[] = [
  {
    equivalentes: [
      "qa engineer",
      "quality assurance engineer",
      "engenheiro de qualidade de software",
      "engenheira de qualidade de software"
    ]
  },
  {
    equivalentes: [
      "devops engineer",
      "engenheiro devops",
      "engenheira devops"
    ]
  },
  {
    equivalentes: [
      "cybersecurity analyst",
      "cyber security analyst",
      "analista de seguranca da informacao",
      "analista de ciberseguranca"
    ]
  },

  {
    equivalentes: [
      "frontend developer",
      "front end developer",
      "desenvolvedor frontend",
      "desenvolvedora frontend",
      "desenvolvedor front end",
      "desenvolvedora front end"
    ]
  },
  {
    equivalentes: [
      "backend developer",
      "back end developer",
      "desenvolvedor backend",
      "desenvolvedora backend",
      "desenvolvedor back end",
      "desenvolvedora back end"
    ]
  },
  {
    equivalentes: [
      "it support specialist",
      "especialista em suporte de ti",
      "especialista em suporte tecnico",
      "technical support specialist"
    ]
  },
  {
    equivalentes: [
      "automation specialist",
      "especialista em automacao"
    ]
  },
  {
    equivalentes: [
      "ai automation engineer",
      "engenheiro de automacao com ia",
      "engenheira de automacao com ia",
      "engenheiro de automacao com inteligencia artificial",
      "engenheira de automacao com inteligencia artificial"
    ]
  },


  {
    equivalentes: [
      "data scientist",
      "cientista de dados"
    ]
  },
  {
    equivalentes: [
      "data engineer",
      "engenheiro de dados",
      "engenheira de dados"
    ]
  },
  {
    equivalentes: [
      "machine learning engineer",
      "engenheiro de machine learning",
      "engenheira de machine learning"
    ]
  },
  {
    equivalentes: [
      "ai engineer",
      "artificial intelligence engineer",
      "engenheiro de inteligencia artificial",
      "engenheira de inteligencia artificial"
    ]
  },

  {
    equivalentes: [
      "data analyst",
      "analista de dados",
      "analista dados"
    ],
    relacionados: [
      "business intelligence analyst",
      "analista de bi"
    ]
  },
  {
    equivalentes: [
      "english teacher",
      "english instructor",
      "professor de ingles",
      "professora de ingles",
      "instrutor de ingles",
      "instrutora de ingles"
    ]
  },
  {
    equivalentes: [
      "python developer",
      "desenvolvedor python",
      "desenvolvedora python"
    ],
    relacionados: [
      "python engineer",
      "engenheiro python",
      "engenheira python"
    ]
  },
  {
    equivalentes: [
      "python engineer",
      "engenheiro python",
      "engenheira python"
    ],
    relacionados: [
      "python developer",
      "desenvolvedor python",
      "desenvolvedora python"
    ]
  },
  {
    equivalentes: [
      "software engineer",
      "engenheiro de software",
      "engenheira de software"
    ],
    relacionados: [
      "software developer",
      "desenvolvedor de software",
      "desenvolvedora de software"
    ]
  }
];

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function contemCargo(titulo: string, cargo: string): boolean {
  return (` ${titulo} `).includes(` ${cargo} `);
}

export function verificarEquivalenciaCargo(
  cargoVaga: string,
  cargoDesejado: string
): EquivalenciaCargo {
  const titulo = normalizar(cargoVaga);
  const desejado = normalizar(cargoDesejado);

  if (!titulo || !desejado) {
    return "nao_identificada";
  }

  for (const familia of familias) {
    const equivalentes = familia.equivalentes.map(normalizar);
    const relacionados = (familia.relacionados ?? []).map(normalizar);

    const desejadoEquivalente =
      equivalentes.some(cargo => contemCargo(desejado, cargo));

    const vagaEquivalente =
      equivalentes.some(cargo => contemCargo(titulo, cargo));

    const desejadoRelacionado =
      relacionados.some(cargo => contemCargo(desejado, cargo));

    const vagaRelacionada =
      relacionados.some(cargo => contemCargo(titulo, cargo));

    if (desejadoEquivalente && vagaEquivalente) {
      return "direta";
    }

    if (
      (desejadoEquivalente && vagaRelacionada) ||
      (desejadoRelacionado && vagaEquivalente)
    ) {
      return "parcial";
    }
  }

  return "nao_identificada";
}
