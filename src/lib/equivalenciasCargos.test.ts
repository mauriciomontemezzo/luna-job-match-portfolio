import {
  verificarEquivalenciaCargo,
  type EquivalenciaCargo
} from "./equivalenciasCargos";

type Teste = {
  vaga: string;
  desejado: string;
  esperado: EquivalenciaCargo;
};

const testes: Teste[] = [
  {
    vaga: "Data Analyst",
    desejado: "Analista de Dados",
    esperado: "direta"
  },
  {
    vaga: "Analista de Dados",
    desejado: "Data Analyst",
    esperado: "direta"
  },
  {
    vaga: "English Teacher",
    desejado: "Professor de Ingles",
    esperado: "direta"
  },
  {
    vaga: "Professora de Ingles",
    desejado: "English Teacher",
    esperado: "direta"
  },
  {
    vaga: "Python Engineer",
    desejado: "Python Developer",
    esperado: "parcial"
  },
  {
    vaga: "Python Developer",
    desejado: "Python Engineer",
    esperado: "parcial"
  },
  {
    vaga: "Senior Data Engineer",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  },
  {
    vaga: "Content Creator - YouTube",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "Software Engineer",
    desejado: "Engenheiro de Software",
    esperado: "direta"
  },
  {
    vaga: "Software Developer",
    desejado: "Software Engineer",
    esperado: "parcial"
  },
  {
    vaga: "",
    desejado: "Python Developer",
    esperado: "nao_identificada"
  }
];


const testesDadosIA: Teste[] = [
  {
    vaga: "Senior Data Scientist",
    desejado: "Cientista de Dados",
    esperado: "direta"
  },
  {
    vaga: "Engenheira de Dados",
    desejado: "Data Engineer",
    esperado: "direta"
  },
  {
    vaga: "Machine Learning Engineer",
    desejado: "Engenheiro de Machine Learning",
    esperado: "direta"
  },
  {
    vaga: "AI Engineer",
    desejado: "Engenheira de Inteligencia Artificial",
    esperado: "direta"
  },
  {
    vaga: "Data Engineer",
    desejado: "Data Scientist",
    esperado: "nao_identificada"
  },
  {
    vaga: "Machine Learning Engineer",
    desejado: "Data Engineer",
    esperado: "nao_identificada"
  },
  {
    vaga: "AI Engineer",
    desejado: "English Teacher",
    esperado: "nao_identificada"
  },
  {
    vaga: "Data Scientist",
    desejado: "Data Analyst",
    esperado: "nao_identificada"
  }
];

testes.push(...testesDadosIA);


const testesTecnologia: Teste[] = [
  {
    vaga: "Frontend Developer",
    desejado: "Desenvolvedor Frontend",
    esperado: "direta"
  },
  {
    vaga: "Desenvolvedora Front End",
    desejado: "Front End Developer",
    esperado: "direta"
  },
  {
    vaga: "Backend Developer",
    desejado: "Desenvolvedor Backend",
    esperado: "direta"
  },
  {
    vaga: "Desenvolvedora Back End",
    desejado: "Back End Developer",
    esperado: "direta"
  },
  {
    vaga: "IT Support Specialist",
    desejado: "Especialista em Suporte de TI",
    esperado: "direta"
  },
  {
    vaga: "Technical Support Specialist",
    desejado: "Especialista em Suporte Tecnico",
    esperado: "direta"
  },
  {
    vaga: "Automation Specialist",
    desejado: "Especialista em Automacao",
    esperado: "direta"
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Engenheiro de Automacao com IA",
    esperado: "direta"
  },
  {
    vaga: "Frontend Developer",
    desejado: "Backend Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "Backend Developer",
    desejado: "Frontend Developer",
    esperado: "nao_identificada"
  },
  {
    vaga: "AI Automation Engineer",
    desejado: "Automation Specialist",
    esperado: "nao_identificada"
  },
  {
    vaga: "IT Support Specialist",
    desejado: "Data Engineer",
    esperado: "nao_identificada"
  }
];

testes.push(...testesTecnologia);

let aprovados = 0;

for (const teste of testes) {
  const resultado = verificarEquivalenciaCargo(
    teste.vaga,
    teste.desejado
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

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
