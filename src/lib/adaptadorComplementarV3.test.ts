import {
  adaptarDiagnosticoComplementarV3
} from "./adaptadorComplementarV3";

import {
  adaptarDiagnosticoCombinadoV3
} from "./adaptadorCombinadoV3";

let aprovados = 0;
let total = 0;

function verificar(nome: string, condicao: boolean) {
  total++;

  console.log(
    condicao ? "OK" : "FALHOU",
    "|",
    nome
  );

  if (condicao) aprovados++;
}

const casos = [
  {
    vaga: "Backend Developer",
    desejado: "Software Engineer",
    esperado: "parcial",
    complementar: true
  },
  {
    vaga: "Software Engineer",
    desejado: "Backend Developer",
    esperado: "parcial",
    complementar: true
  },
  {
    vaga: "Machine Learning Engineer",
    desejado: "AI Engineer",
    esperado: "parcial",
    complementar: true
  },
  {
    vaga: "AI Engineer",
    desejado: "Machine Learning Engineer",
    esperado: "parcial",
    complementar: true
  },
  {
    vaga: "English Teacher",
    desejado: "ESL Instructor",
    esperado: "direta",
    complementar: false
  },
  {
    vaga: "Data Engineer",
    desejado: "Data Scientist",
    esperado: "nao_identificada",
    complementar: false
  },
  {
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    esperado: "parcial",
    complementar: false
  }
] as const;

for (const caso of casos) {
  const resultado = adaptarDiagnosticoComplementarV3(
    caso.vaga,
    caso.desejado
  )[0];

  const original = adaptarDiagnosticoCombinadoV3(
    caso.vaga,
    caso.desejado
  )[0];

  verificar(
    caso.vaga + " -> " + caso.desejado,
    Boolean(resultado) &&
    resultado.classificacaoExpandida === caso.esperado &&
    resultado.origemComplementar === caso.complementar &&
    resultado.revisaoComplementar === caso.complementar &&
    resultado.classificacaoOriginal ===
      original.classificacaoOriginal &&
    resultado.alteraPontuacao === false &&
    resultado.alteraPrioridade === false
  );
}

verificar(
  "Aceita lista vazia",
  adaptarDiagnosticoComplementarV3(
    "English Teacher",
    ""
  ).length === 0
);

const multiplos = adaptarDiagnosticoComplementarV3(
  "Backend Developer",
  "Software Engineer, English Teacher, Data Scientist"
);

verificar(
  "Preserva ordem de multiplos cargos",
  multiplos.map((item) => item.cargoDesejado).join("|") ===
  "Software Engineer|English Teacher|Data Scientist"
);

verificar(
  "Todos os resultados sao experimentais",
  multiplos.every((item) => item.experimental === true)
);

console.log(
  `RESULTADO_ADAPTADOR_COMPLEMENTAR: ${aprovados}/${total}`
);

if (aprovados !== total) {
  process.exitCode = 1;
}
