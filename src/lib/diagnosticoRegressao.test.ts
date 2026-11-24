import {
  diagnosticarCompatibilidadeProfissional
} from "./diagnosticoProfissional";

const testes = [
  {
    nome: "Cargo e tecnologia identicos",
    vaga: "Python Frontend Developer",
    desejado: "Python Frontend Developer",
    esperado: "coerente"
  },
  {
    nome: "Tecnologia compartilhada",
    vaga: "Python React Frontend Developer",
    desejado: "React Frontend Developer",
    esperado: "coerente"
  },
  {
    nome: "Tecnologias diferentes",
    vaga: "Python Frontend Developer",
    desejado: "React Frontend Developer",
    esperado: "revisar"
  },
  {
    nome: "Especialidades diferentes",
    vaga: "Python Frontend Developer",
    desejado: "React Backend Developer",
    esperado: "coerente"
  },
  {
    nome: "Tecnologia ausente no desejado",
    vaga: "Python Frontend Developer",
    desejado: "Frontend Developer",
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
