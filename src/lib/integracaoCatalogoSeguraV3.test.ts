import {
  integrarCatalogoSeguraV3
} from "./integracaoCatalogoSeguraV3";

import type {
  RelacaoCatalogoV3
} from "./compararCatalogoExpansaoV3";

const casos: {
  nome: string;
  vaga: string;
  desejado: string;
  original: RelacaoCatalogoV3;
  esperado: RelacaoCatalogoV3;
  revisao: boolean;
}[] = [
  {
    nome: "Preserva direta original",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "direta",
    esperado: "direta",
    revisao: false
  },
  {
    nome: "Preserva parcial original",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "parcial",
    esperado: "parcial",
    revisao: false
  },
  {
    nome: "Educacao exige revisao",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "nao_identificada",
    esperado: "parcial",
    revisao: true
  },
  {
    nome: "Administracao parcial",
    vaga: "Administrative Assistant",
    desejado: "Office Assistant",
    original: "nao_identificada",
    esperado: "parcial",
    revisao: false
  },
  {
    nome: "Atendimento parcial",
    vaga: "Customer Support Representative",
    desejado: "Customer Service Representative",
    original: "nao_identificada",
    esperado: "parcial",
    revisao: false
  },
  {
    nome: "Financas parcial",
    vaga: "Financial Analyst",
    desejado: "Financial Planning Analyst",
    original: "nao_identificada",
    esperado: "parcial",
    revisao: false
  },
  {
    nome: "Profissoes diferentes",
    vaga: "Astronaut",
    desejado: "Financial Analyst",
    original: "nao_identificada",
    esperado: "nao_identificada",
    revisao: false
  },
  {
    nome: "Cargo vazio",
    vaga: "",
    desejado: "English Tutor",
    original: "nao_identificada",
    esperado: "nao_identificada",
    revisao: false
  }
];

let aprovados = 0;

for (const caso of casos) {
  const obtido = integrarCatalogoSeguraV3(
    caso.vaga,
    caso.desejado,
    caso.original
  );

  const passou =
    obtido.classificacao === caso.esperado &&
    obtido.revisaoSemantica === caso.revisao;

  console.log(
    passou ? "OK" : "FALHOU",
    "|",
    caso.nome,
    "|",
    obtido.classificacao,
    "| revisao:",
    obtido.revisaoSemantica
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO_SEGURANCA: ${aprovados}/${casos.length}`
);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
