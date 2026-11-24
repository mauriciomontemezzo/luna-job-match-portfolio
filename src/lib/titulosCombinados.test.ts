import { analisarCargo } from "./compatibilidadeVagas";

const testes = [
  {
    vaga: "Data Scientist / Data Engineer",
    desejado: "Data Scientist",
    esperado: "direta"
  },
  {
    vaga: "Data Scientist / Data Engineer",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  },
  {
    vaga: "Python Developer / Data Analyst",
    desejado: "Python Developer",
    esperado: "direta"
  },
  {
    vaga: "Python Developer / Data Analyst",
    desejado: "Python Instructor",
    esperado: "nao_identificada"
  },
  {
    vaga: "AI Engineer / Machine Learning Engineer",
    desejado: "AI Engineer",
    esperado: "direta"
  },
  {
    vaga: "Data Engineer / Data Scientist",
    desejado: "English Teacher",
    esperado: "nao_identificada"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarCargo(
    teste.vaga,
    teste.desejado
  );

  const passou = resultado.relevancia === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| desejado:", teste.desejado,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.relevancia
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
