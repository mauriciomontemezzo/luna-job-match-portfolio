import { explicarClassificacaoV2 } from "./explicacaoClassificacaoV2";

let aprovados = 0;
let total = 0;

function verificar(nome: string, condicao: boolean) {
  total++;

  console.log(
    `${condicao ? "OK" : "FALHOU"} | ${nome}`
  );

  if (condicao) {
    aprovados++;
  }
}

const dataEngineer = explicarClassificacaoV2(
  "Senior Data Engineer",
  "Python Developer",
  ["Python", "SQL"]
);

verificar(
  "Identifica Python como evidencia",
  dataEngineer.evidencias.some((item) =>
    item.includes("Python")
  )
);

verificar(
  "Identifica engenharia de dados",
  dataEngineer.evidencias.some((item) =>
    item.includes("engenharia de dados")
  )
);

verificar(
  "Preserva classificacao relacionada",
  dataEngineer.classificacao === "oportunidades_relacionadas"
);

verificar(
  "Informa limitacoes",
  dataEngineer.limitacoes.length > 0
);

const backend = explicarClassificacaoV2(
  "Senior Back-end Developer",
  "Python Developer",
  ["Python"]
);

verificar(
  "Identifica desenvolvimento backend",
  backend.evidencias.some((item) =>
    item.includes("backend")
  )
);

verificar(
  "Preserva classificacao backend",
  backend.classificacao === "oportunidades_relacionadas"
);

const semRelacao = explicarClassificacaoV2(
  "Financial Analyst",
  "Python Developer",
  []
);

verificar(
  "Nao inventa evidencias",
  semRelacao.evidencias.length === 0
);

verificar(
  "Nao inventa relacao profissional",
  semRelacao.classificacao === "outras_oportunidades"
);

verificar(
  "Resultados identificados como experimentais",
  dataEngineer.experimental === true &&
  backend.experimental === true &&
  semRelacao.experimental === true
);

console.log(
  `RESULTADO_EXPLICACAO_V2: ${aprovados}/${total}`
);

if (aprovados !== total) {
  process.exitCode = 1;
}
