import {
  diagnosticarCompatibilidadeProfissional
} from "./diagnosticoProfissional";

const testes = [
  {
    nome: "Estrutura semelhante sem equivalencia",
    vaga: "Python Data Analyst",
    desejado: "Data Analyst",
    esperado: "coerente"
  },
  {
    nome: "Correspondencia direta",
    vaga: "Frontend Developer",
    desejado: "Frontend Developer",
    esperado: "coerente"
  },
  {
    nome: "Especialidades diferentes",
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    esperado: "coerente"
  },
  {
    nome: "Funcoes diferentes com tecnologia comum",
    vaga: "Python Developer",
    desejado: "Python Engineer",
    esperado: "coerente"
  },
  {
    nome: "Cargo sem estrutura reconhecida",
    vaga: "Unknown Position",
    desejado: "Data Analyst",
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

  const passou =
    resultado.situacao === teste.esperado;

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
