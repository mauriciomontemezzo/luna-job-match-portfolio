import {
  integrarCatalogoExpansaoV3
} from "./integracaoCatalogoExpansaoV3";

type Classificacao =
  | "direta"
  | "parcial"
  | "nao_identificada";

const casos: {
  nome: string;
  vaga: string;
  desejado: string;
  original: Classificacao;
  esperado: Classificacao;
  origem: "original" | "catalogo_expansao";
}[] = [
  {
    nome: "Preserva correspondencia direta",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "direta",
    esperado: "direta",
    origem: "original"
  },
  {
    nome: "Preserva correspondencia parcial",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "parcial",
    esperado: "parcial",
    origem: "original"
  },
  {
    nome: "Expansao educacao",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "nao_identificada",
    esperado: "direta",
    origem: "catalogo_expansao"
  },
  {
    nome: "Expansao administracao",
    vaga: "Administrative Assistant",
    desejado: "Office Assistant",
    original: "nao_identificada",
    esperado: "parcial",
    origem: "catalogo_expansao"
  },
  {
    nome: "Expansao atendimento",
    vaga: "Customer Support Representative",
    desejado: "Customer Service Representative",
    original: "nao_identificada",
    esperado: "parcial",
    origem: "catalogo_expansao"
  },
  {
    nome: "Expansao financas",
    vaga: "Financial Analyst",
    desejado: "Financial Planning Analyst",
    original: "nao_identificada",
    esperado: "parcial",
    origem: "catalogo_expansao"
  },
  {
    nome: "Profissoes sem relacao",
    vaga: "Astronaut",
    desejado: "Financial Analyst",
    original: "nao_identificada",
    esperado: "nao_identificada",
    origem: "original"
  },
  {
    nome: "Preserva parcial mesmo sem relacao",
    vaga: "Astronaut",
    desejado: "Financial Analyst",
    original: "parcial",
    esperado: "parcial",
    origem: "original"
  },
  {
    nome: "Cargo vazio",
    vaga: "",
    desejado: "English Tutor",
    original: "nao_identificada",
    esperado: "nao_identificada",
    origem: "original"
  }
];

let aprovados = 0;

for (const caso of casos) {
  const obtido = integrarCatalogoExpansaoV3(
    caso.vaga,
    caso.desejado,
    caso.original
  );

  const passou =
    obtido.classificacao === caso.esperado &&
    obtido.origem === caso.origem;

  console.log(
    passou ? "OK" : "FALHOU",
    "|",
    caso.nome,
    "| esperado:",
    caso.esperado,
    caso.origem,
    "| obtido:",
    obtido.classificacao,
    obtido.origem
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO_INTEGRACAO: ${aprovados}/${casos.length}`
);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
