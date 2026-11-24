import { analisarSenioridade } from "./analiseSenioridade";
import type { NivelSenioridade } from "./analiseSenioridade";

type Teste = {
  cargo: string;
  esperado: NivelSenioridade;
};

const testes: Teste[] = [
  {
    cargo: "Junior Python Developer",
    esperado: "junior"
  },
  {
    cargo: "Jr. Software Engineer",
    esperado: "junior"
  },
  {
    cargo: "Entry Level Data Analyst",
    esperado: "junior"
  },
  {
    cargo: "Mid-Level Software Engineer",
    esperado: "pleno"
  },
  {
    cargo: "Pleno Data Analyst",
    esperado: "pleno"
  },
  {
    cargo: "Senior Data Engineer",
    esperado: "senior"
  },
  {
    cargo: "Sr. Python Developer",
    esperado: "senior"
  },
  {
    cargo: "Principal Software Engineer",
    esperado: "senior"
  },
  {
    cargo: "Tech Lead Full-Stack Engineer",
    esperado: "lideranca"
  },
  {
    cargo: "Engineering Manager",
    esperado: "lideranca"
  },
  {
    cargo: "Head of Engineering",
    esperado: "lideranca"
  },
  {
    cargo: "Python Developer",
    esperado: "nao_identificada"
  },
  {
    cargo: "Remote Office Assistant",
    esperado: "nao_identificada"
  }
];

let aprovados = 0;

for (const teste of testes) {
  const resultado = analisarSenioridade(teste.cargo);
  const passou = resultado.nivel === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.cargo,
    "| esperado:", teste.esperado,
    "| obtido:", resultado.nivel
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
