import {
  diagnosticarMultiplosCargos
} from "./diagnosticoMultiplosCargos";

const testes = [
  {
    nome: "Dois cargos diferentes",
    vaga: "Python Frontend Developer",
    desejados: "React Frontend Developer, Backend Developer",
    cargosEsperados: [
      "React Frontend Developer",
      "Backend Developer"
    ],
    situacoes: ["revisar", "coerente"]
  },
  {
    nome: "Cargo unico",
    vaga: "Frontend Developer",
    desejados: "Frontend Developer",
    cargosEsperados: ["Frontend Developer"],
    situacoes: ["coerente"]
  },
  {
    nome: "Cargos duplicados",
    vaga: "Data Analyst",
    desejados: "Data Analyst, Data Analyst",
    cargosEsperados: ["Data Analyst"],
    situacoes: ["coerente"]
  },
  {
    nome: "Separadores diferentes",
    vaga: "Frontend Developer",
    desejados: "Frontend Developer; Backend Developer\nData Analyst",
    cargosEsperados: [
      "Frontend Developer",
      "Backend Developer",
      "Data Analyst"
    ],
    situacoes: ["coerente", "coerente", "coerente"]
  },
  {
    nome: "Entradas vazias",
    vaga: "Frontend Developer",
    desejados: " , ; \n ",
    cargosEsperados: [],
    situacoes: []
  }
];

const testesOrdenacao = [
  {
    nome: "Prioridade direta antes de nao identificada",
    vaga: "Backend Developer",
    desejados: "Data Analyst, Backend Developer",
    ordem: ["Backend Developer", "Data Analyst"]
  },
  {
    nome: "Ordem original entre classificacoes iguais",
    vaga: "Backend Developer",
    desejados: "Data Analyst, English Teacher, Backend Developer",
    ordem: [
      "Backend Developer",
      "Data Analyst",
      "English Teacher"
    ]
  }
];

for (const teste of testesOrdenacao) {
  const resultado = diagnosticarMultiplosCargos(
    teste.vaga,
    teste.desejados
  );

  const ordemObtida = resultado.map(
    (item) => item.cargoDesejado
  );

  const passou =
    JSON.stringify(ordemObtida) ===
    JSON.stringify(teste.ordem);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| ordem:", ordemObtida.join(" > ")
  );

  if (!passou) process.exitCode = 1;
}

let aprovados = 0;

for (const teste of testes) {
  const resultado = diagnosticarMultiplosCargos(
    teste.vaga,
    teste.desejados
  );

  const cargos = resultado.map(
    (item) => item.cargoDesejado
  );

  const situacoes = resultado.map(
    (item) => item.situacao
  );

  const passou =
    JSON.stringify(cargos) ===
      JSON.stringify(teste.cargosEsperados) &&
    JSON.stringify(situacoes) ===
      JSON.stringify(teste.situacoes);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| cargos:", cargos.length,
    "| situacoes:", situacoes.join(", ") || "nenhuma"
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
