import {
  compararCatalogoExpansaoV3,
  type RelacaoCatalogoV3
} from "./compararCatalogoExpansaoV3";

type Relacao = RelacaoCatalogoV3;

const casos: {
  nome: string;
  a: string;
  b: string;
  esperado: Relacao;
}[] = [
  {
    nome: "Educacao",
    a: "English Tutor",
    b: "English Language Instructor",
    esperado: "direta"
  },
  {
    nome: "Administracao",
    a: "Administrative Assistant",
    b: "Office Assistant",
    esperado: "parcial"
  },
  {
    nome: "Atendimento",
    a: "Customer Support Representative",
    b: "Customer Service Representative",
    esperado: "parcial"
  },
  {
    nome: "Financas",
    a: "Financial Analyst",
    b: "Financial Planning Analyst",
    esperado: "parcial"
  },
  {
    nome: "Areas diferentes",
    a: "English Tutor",
    b: "Financial Analyst",
    esperado: "nao_identificada"
  },
  {
    nome: "Cargo ausente",
    a: "Astronaut",
    b: "English Tutor",
    esperado: "nao_identificada"
  },
  {
    nome: "Cargo vazio",
    a: "",
    b: "Office Assistant",
    esperado: "nao_identificada"
  },
  {
    nome: "Maiusculas e espacos",
    a: "  ENGLISH TUTOR  ",
    b: "english language instructor",
    esperado: "direta"
  }
];

let aprovados = 0;

for (const caso of casos) {
  const obtido = compararCatalogoExpansaoV3(caso.a, caso.b);
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
  `RESULTADO_RELACOES: ${aprovados}/${casos.length}`
);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
