import {
  classificarOportunidade
} from "./classificacaoOportunidades";

const testes = [
  {
    vaga: "QA Engineer",
    desejado: "Engenheiro de Qualidade de Software",
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "DevOps Engineer",
    desejado: "Engenheiro DevOps",
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "Cybersecurity Analyst",
    desejado: "Analista de Segurança da Informação",
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "QA Engineer",
    desejado: "English Teacher",
    esperado: "outras_oportunidades"
  },
  {
    vaga: "DevOps Engineer",
    desejado: "Data Analyst",
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Python Developer",
    desejado: "Python Engineer",
    esperado: "oportunidades_relacionadas"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const obtido = classificarOportunidade(
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
