import {
  verificarEquivalenciaCargo
} from "./equivalenciasCargos";

const testes = [
  {
    vaga: "QA Engineer",
    desejado: "Engenheiro de Qualidade de Software",
    esperado: "direta"
  },
  {
    vaga: "DevOps Engineer",
    desejado: "Engenheiro DevOps",
    esperado: "direta"
  },
  {
    vaga: "Cybersecurity Analyst",
    desejado: "Analista de Segurança da Informação",
    esperado: "direta"
  },
  {
    vaga: "QA Engineer",
    desejado: "English Teacher",
    esperado: "nao_identificada"
  },
  {
    vaga: "DevOps Engineer",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  },
  {
    vaga: "Python Developer",
    desejado: "Python Engineer",
    esperado: "parcial"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const obtido = verificarEquivalenciaCargo(
    teste.vaga,
    teste.desejado
  );

  const passou = obtido === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| esperado:", teste.esperado,
    "| obtido:", obtido
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
