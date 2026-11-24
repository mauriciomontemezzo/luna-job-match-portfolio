import {
  diagnosticarCompatibilidadeProfissional
} from "./diagnosticoProfissional";

const testes = [
  {
    nome: "Mesma estrutura com especialidade comum",
    vaga: "Python Frontend Developer",
    desejado: "React Frontend Developer",
    esperado: "revisar"
  },
  {
    nome: "Correspondencia parcial sem estrutura comum",
    vaga: "Project Coordinator",
    desejado: "Project Manager",
    esperado: "revisar"
  },
  {
    nome: "Profissoes com elementos diferentes",
    vaga: "Software Engineer",
    desejado: "Software Developer",
    esperado: "coerente"
  },
  {
    nome: "Especialidades distintas",
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    esperado: "coerente"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado =
    diagnosticarCompatibilidadeProfissional(
      teste.vaga,
      teste.desejado
    );

  const passou = resultado.situacao === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.nome,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.situacao,
    "| motivos:", resultado.motivos.join("; ") || "nenhum"
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
