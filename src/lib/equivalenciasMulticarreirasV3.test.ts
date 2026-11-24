import {
  verificarRelacaoProfissionalV3
} from "./equivalenciasMulticarreirasV3";

type Relacao = "direta" | "parcial" | "nao_identificada";

type Caso = {
  nome: string;
  desejado: string;
  encontrado: string;
  esperado: Relacao;
};

const casos: Caso[] = [
  {
    nome: "Professor de ingles e ESL",
    desejado: "English Teacher",
    encontrado: "ESL Instructor",
    esperado: "direta"
  },
  {
    nome: "Analista de dados e BI",
    desejado: "Data Analyst",
    encontrado: "Business Intelligence Analyst",
    esperado: "parcial"
  },
  {
    nome: "Suporte TI e Help Desk",
    desejado: "IT Support Specialist",
    encontrado: "Help Desk Technician",
    esperado: "parcial"
  },
  {
    nome: "Automacao IA e Workflow",
    desejado: "AI Automation Developer",
    encontrado: "AI Workflow Developer",
    esperado: "parcial"
  },
  {
    nome: "Profissoes sem relacao",
    desejado: "Data Engineer",
    encontrado: "English Teacher",
    esperado: "nao_identificada"
  },
  {
    nome: "Maiusculas e minusculas",
    desejado: "ENGLISH TEACHER",
    encontrado: "esl instructor",
    esperado: "direta"
  },
  {
    nome: "Acentuacao",
    desejado: "Professor de Inglês",
    encontrado: "ESL Teacher",
    esperado: "direta"
  },
  {
    nome: "Cargo vazio",
    desejado: "",
    encontrado: "Help Desk Technician",
    esperado: "nao_identificada"
  },
  {
    nome: "Relacao profissional inversa",
    desejado: "Help Desk Technician",
    encontrado: "IT Support Specialist",
    esperado: "parcial"
  }
];

let aprovados = 0;

for (const caso of casos) {
  const obtido = verificarRelacaoProfissionalV3(
    caso.encontrado,
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

console.log(`RESULTADO_V3: ${aprovados}/${casos.length}`);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
