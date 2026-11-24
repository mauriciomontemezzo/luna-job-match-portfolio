import {
  diagnosticarCompatibilidadeProfissional
} from "./diagnosticoProfissional";

const testes = [
  {
    vaga: "Frontend Developer",
    desejado: "Frontend Developer",
    classificacao: "direta",
    situacao: "coerente"
  },
  {
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    classificacao: "nao_identificada",
    situacao: "coerente"
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Automation Specialist",
    classificacao: "nao_identificada",
    situacao: "coerente"
  },
  {
    vaga: "React Frontend Developer",
    desejado: "Frontend Developer",
    classificacao: "direta",
    situacao: "coerente"
  },
  {
    vaga: "Data Analyst",
    desejado: "Analista de Dados",
    classificacao: "direta",
    situacao: "coerente"
  },
  {
    vaga: "Python Developer",
    desejado: "Python Engineer",
    classificacao: "parcial",
    situacao: "coerente"
  },
  {
    vaga: "Unknown Position",
    desejado: "Data Analyst",
    classificacao: "nao_identificada",
    situacao: "coerente"
  },
  {
    vaga: "Python / React Developer",
    desejado: "React Frontend Developer",
    classificacao: "parcial",
    situacao: "coerente"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado =
    diagnosticarCompatibilidadeProfissional(
      teste.vaga,
      teste.desejado
    );

  const passou =
    resultado.classificacaoAtual === teste.classificacao &&
    resultado.situacao === teste.situacao;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| desejado:", teste.desejado,
    "| classificacao:", resultado.classificacaoAtual,
    "| situacao:", resultado.situacao
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
