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
  classificacao: RelacaoCatalogoV3;
  origem: "original" | "catalogo_expansao";
  revisao: boolean;
}[] = [
  {
    nome: "Direta original preservada",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "direta",
    classificacao: "direta",
    origem: "original",
    revisao: false
  },
  {
    nome: "Parcial original preservada",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "parcial",
    classificacao: "parcial",
    origem: "original",
    revisao: false
  },
  {
    nome: "Direta experimental rebaixada",
    vaga: "English Tutor",
    desejado: "English Language Instructor",
    original: "nao_identificada",
    classificacao: "parcial",
    origem: "catalogo_expansao",
    revisao: true
  },
  {
    nome: "Parcial administrativa",
    vaga: "Administrative Assistant",
    desejado: "Office Assistant",
    original: "nao_identificada",
    classificacao: "parcial",
    origem: "catalogo_expansao",
    revisao: false
  },
  {
    nome: "Sem correspondencia",
    vaga: "Astronaut",
    desejado: "Financial Analyst",
    original: "nao_identificada",
    classificacao: "nao_identificada",
    origem: "original",
    revisao: false
  },
  {
    nome: "Cargo vazio",
    vaga: "",
    desejado: "English Tutor",
    original: "nao_identificada",
    classificacao: "nao_identificada",
    origem: "original",
    revisao: false
  }
];

let aprovados = 0;

for (const caso of casos) {
  const resultado = integrarCatalogoSeguraV3(
    caso.vaga,
    caso.desejado,
    caso.original
  );

  const passou =
    resultado.classificacao === caso.classificacao &&
    resultado.origem === caso.origem &&
    resultado.revisaoSemantica === caso.revisao;

  console.log(
    passou ? "OK" : "FALHOU",
    "|",
    caso.nome,
    "| classificacao:",
    resultado.classificacao,
    "| origem:",
    resultado.origem,
    "| revisao:",
    resultado.revisaoSemantica
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO_ORIGEM: ${aprovados}/${casos.length}`
);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
