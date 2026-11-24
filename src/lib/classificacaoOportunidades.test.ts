import {
  classificarOportunidade
} from "./classificacaoOportunidades";

const testes = [
  {
    vaga: "Backend Developer",
    desejados: "Data Analyst, Backend Developer",
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "Python Engineer",
    desejados: "Python Developer",
    esperado: "oportunidades_relacionadas"
  },
  {
    vaga: "Senior Data Engineer",
    desejados: "English Teacher",
    esperado: "outras_oportunidades"
  },
  {
    vaga: "English Teacher",
    desejados: "Python Developer, Professor de Ingles",
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "",
    desejados: "",
    esperado: "outras_oportunidades"
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = classificarOportunidade(
    teste.vaga,
    teste.desejados
  );

  const passou = resultado === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga || "(vazio)",
    "| esperado:", teste.esperado,
    "| obtido:", resultado
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
