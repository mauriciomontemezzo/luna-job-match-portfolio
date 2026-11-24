import { analisarCargo } from "./compatibilidadeVagas";

const testes = [
  {
    vaga: "Python Developer",
    desejado: "Python Developer",
    esperado: "direta"
  },
  {
    vaga: "Senior Python Developer",
    desejado: "Python Developer",
    esperado: "direta"
  },
  {
    vaga: "Python Engineer",
    desejado: "Python Developer",
    esperado: "parcial"
  },
  {
    vaga: "Data Analyst",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "Content Creator - YouTube",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  }
];


const testesAdicionais = [
  {
    vaga: "Senior Data Engineer",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  },
  {
    vaga: "Data Engineer",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  },
  {
    vaga: "Data Analyst",
    desejado: "Analista de Dados",
    esperado: "direta"
  },
  {
    vaga: "English Teacher",
    desejado: "Professor de Ingles",
    esperado: "direta"
  },
  {
    vaga: "Python Engineer",
    desejado: "Python Developer",
    esperado: "parcial"
  },
  {
    vaga: "Data Analyst",
    desejado: "Python Developer, Analista de Dados",
    esperado: "direta"
  }
];

testes.push(...testesAdicionais);


const testesProfissoes = [
  {
    vaga: "Python Data Analyst",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "Python Instructor",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "Python Engineer",
    desejado: "Python Developer",
    esperado: "parcial"
  },
  {
    vaga: "English Teacher",
    desejado: "Professor de Ingles",
    esperado: "direta"
  }
];

testes.push(...testesProfissoes);


const testesMultiplosCargos = [
  {
    vaga: "Python Engineer",
    desejado: "Python Developer, Engenheiro Python",
    esperado: "direta"
  },
  {
    vaga: "Software Engineer",
    desejado: "Software Developer, Engenheiro de Software",
    esperado: "direta"
  },
  {
    vaga: "English Teacher",
    desejado: "Python Developer, Professor de Ingles",
    esperado: "direta"
  },
  {
    vaga: "Python Engineer",
    desejado: "Data Analyst, Python Developer",
    esperado: "parcial"
  }
];

testes.push(...testesMultiplosCargos);

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
    "| esperado:", teste.esperado,
    "| obtido:", resultado.relevancia
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
