import {
  verificarRelacaoComplementarV3
} from "./relacoesComplementaresV3";

type Resultado = "parcial" | "nao_identificada";

const casos: {
  nome: string;
  vaga: string;
  desejado: string;
  esperado: Resultado;
}[] = [
  {
    nome: "Backend e Software Engineer",
    vaga: "Backend Developer",
    desejado: "Software Engineer",
    esperado: "parcial"
  },
  {
    nome: "Relacao inversa Backend",
    vaga: "Software Engineer",
    desejado: "Backend Developer",
    esperado: "parcial"
  },
  {
    nome: "Machine Learning e AI",
    vaga: "Machine Learning Engineer",
    desejado: "AI Engineer",
    esperado: "parcial"
  },
  {
    nome: "Relacao inversa AI",
    vaga: "AI Engineer",
    desejado: "Machine Learning Engineer",
    esperado: "parcial"
  },
  {
    nome: "Maiusculas e espacos",
    vaga: "  BACKEND DEVELOPER ",
    desejado: " software ENGINEER ",
    esperado: "parcial"
  },
  {
    nome: "Data Engineer e Data Scientist",
    vaga: "Data Engineer",
    desejado: "Data Scientist",
    esperado: "nao_identificada"
  },
  {
    nome: "Profissoes sem relacao",
    vaga: "English Teacher",
    desejado: "Software Engineer",
    esperado: "nao_identificada"
  },
  {
    nome: "Cargo vazio",
    vaga: "",
    desejado: "AI Engineer",
    esperado: "nao_identificada"
  },
  {
    nome: "Cargos desconhecidos",
    vaga: "Astronaut",
    desejado: "Financial Analyst",
    esperado: "nao_identificada"
  }
];

let aprovados = 0;

for (const caso of casos) {
  const obtido = verificarRelacaoComplementarV3(
    caso.vaga,
    caso.desejado
  );

  const passou = obtido === caso.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|",
    caso.nome,
    "| esperado:",
    caso.esperado,
    "| obtido:",
    obtido
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO_COMPLEMENTAR: ${aprovados}/${casos.length}`
);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
