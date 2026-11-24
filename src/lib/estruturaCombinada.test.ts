import { analisarEstruturaProfissional } from "./estruturaProfissional";

const testes = [
  {
    cargo: "Frontend / Backend Developer",
    funcao: "desenvolvimento",
    especialidade: "frontend",
    tecnologias: []
  },
  {
    cargo: "Developer / Data Analyst",
    funcao: "desenvolvimento",
    especialidade: "dados",
    tecnologias: []
  },
  {
    cargo: "AI Automation Engineer",
    funcao: "engenharia",
    especialidade: "automacao",
    tecnologias: []
  },
  {
    cargo: "Python / React Developer",
    funcao: "desenvolvimento",
    especialidade: null,
    tecnologias: ["python", "react"]
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarEstruturaProfissional(
    teste.cargo
  );

  const passou =
    resultado.funcao === teste.funcao &&
    resultado.especialidade === teste.especialidade &&
    JSON.stringify(resultado.tecnologias) ===
      JSON.stringify(teste.tecnologias);

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.cargo,
    "| funcao:", resultado.funcao,
    "| especialidade:", resultado.especialidade,
    "| tecnologias:", resultado.tecnologias.join(", ")
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
