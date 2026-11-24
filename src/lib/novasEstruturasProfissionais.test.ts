import {
  analisarEstruturaProfissional
} from "./estruturaProfissional";

const testes = [
  {
    cargo: "QA Engineer",
    funcao: "engenharia",
    especialidade: "qualidade_software"
  },
  {
    cargo: "Engenheiro de Qualidade de Software",
    funcao: "engenharia",
    especialidade: "qualidade_software"
  },
  {
    cargo: "DevOps Engineer",
    funcao: "engenharia",
    especialidade: "devops"
  },
  {
    cargo: "Engenheiro DevOps",
    funcao: "engenharia",
    especialidade: "devops"
  },
  {
    cargo: "Cybersecurity Analyst",
    funcao: "analise",
    especialidade: "seguranca"
  },
  {
    cargo: "Analista de Segurança da Informação",
    funcao: "analise",
    especialidade: "seguranca"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarEstruturaProfissional(
    teste.cargo
  );

  const passou =
    resultado.funcao === teste.funcao &&
    resultado.especialidade === teste.especialidade;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.cargo,
    "| funcao:", resultado.funcao,
    "| especialidade:", resultado.especialidade
  );

  if (passou) aprovados++;
}

console.log(
  `RESULTADO: ${aprovados}/${testes.length}`
);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
