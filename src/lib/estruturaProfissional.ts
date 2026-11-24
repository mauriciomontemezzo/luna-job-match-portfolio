export type EstruturaProfissional = {
  funcao: string | null;
  especialidade: string | null;
  tecnologias: string[];
  funcoes: string[];
  especialidades: string[];
};

function normalizar(valor: string): string {
  return valor
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function contemExpressao(
  texto: string,
  expressao: string
): boolean {
  return (` ${texto} `).includes(
    ` ${normalizar(expressao)} `
  );
}

const funcoes = [
  {
    nome: "desenvolvimento",
    termos: [
      "developer",
      "desenvolvedor",
      "desenvolvedora"
    ]
  },
  {
    nome: "analise",
    termos: [
      "analyst",
      "analista"
    ]
  },
  {
    nome: "engenharia",
    termos: [
      "engineer",
      "engenheiro",
      "engenheira"
    ]
  },
  {
    nome: "ensino",
    termos: [
      "teacher",
      "professor",
      "professora",
      "instructor",
      "instrutor",
      "instrutora"
    ]
  },
  {
    nome: "suporte",
    termos: [
      "support specialist",
      "especialista em suporte"
    ]
  }
];

const especialidades = [
  {
    nome: "qualidade_software",
    termos: [
      "qa engineer",
      "quality assurance engineer",
      "qualidade de software"
    ]
  },
  {
    nome: "devops",
    termos: [
      "devops"
    ]
  },
  {
    nome: "seguranca",
    termos: [
      "cybersecurity",
      "cyber security",
      "seguranca da informacao",
      "ciberseguranca"
    ]
  },
  {
    nome: "frontend",
    termos: ["frontend", "front end"]
  },
  {
    nome: "backend",
    termos: ["backend", "back end"]
  },
  {
    nome: "dados",
    termos: ["data", "dados"]
  },
  {
    nome: "machine_learning",
    termos: ["machine learning"]
  },
  {
    nome: "automacao",
    termos: ["automation", "automacao"]
  }
];

const tecnologias = [
  "python",
  "javascript",
  "typescript",
  "react",
  "sql",
  "n8n"
];

export function analisarEstruturaProfissional(
  cargo: string
): EstruturaProfissional {
  const titulo = normalizar(cargo);

  const funcao =
    funcoes.find((item) =>
      item.termos.some((termo) =>
        contemExpressao(titulo, termo)
      )
    )?.nome ?? null;

  const especialidade =
    especialidades.find((item) =>
      item.termos.some((termo) =>
        contemExpressao(titulo, termo)
      )
    )?.nome ?? null;

  const encontradas = tecnologias.filter(
    (tecnologia) =>
      contemExpressao(titulo, tecnologia)
  );

  const funcoesEncontradas = funcoes
    .filter((item) =>
      item.termos.some((termo) =>
        contemExpressao(titulo, termo)
      )
    )
    .map((item) => item.nome);

  const especialidadesEncontradas = especialidades
    .filter((item) =>
      item.termos.some((termo) =>
        contemExpressao(titulo, termo)
      )
    )
    .map((item) => item.nome);

  return {
    funcao,
    especialidade,
    tecnologias: encontradas,
    funcoes: funcoesEncontradas,
    especialidades: especialidadesEncontradas
  };
}
