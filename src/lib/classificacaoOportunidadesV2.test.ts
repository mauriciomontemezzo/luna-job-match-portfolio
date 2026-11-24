import { classificarOportunidadeV2 } from "./classificacaoOportunidadesV2";

const testes = [
  {
    vaga: "Python Developer",
    desejados: "Python Developer",
    competencias: ["Python"],
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "Python Engineer",
    desejados: "Python Developer",
    competencias: ["Python"],
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "Senior Back-end Developer",
    desejados: "Python Developer",
    competencias: ["Python", "Docker"],
    esperado: "oportunidades_relacionadas"
  },
  {
    vaga: "Senior Data Engineer",
    desejados: "Python Developer",
    competencias: ["Python", "SQL", "AWS"],
    esperado: "oportunidades_relacionadas"
  },
  {
    vaga: "Content Reviewer",
    desejados: "Python Developer",
    competencias: [],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Remote Office Assistant",
    desejados: "Python Developer",
    competencias: [],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "React Developer",
    desejados: "Python Developer",
    competencias: ["React", "JavaScript"],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "English Teacher",
    desejados: "Python Developer, Professor de Ingles",
    competencias: [],
    esperado: "correspondencia_identificada"
  }
] as const;

let aprovados = 0;

for (const teste of testes) {
  const resultado = classificarOportunidadeV2(
    teste.vaga,
    teste.desejados,
    [...teste.competencias]
  );

  const passou = resultado === teste.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", teste.vaga,
    "| esperado:", teste.esperado,
    "| obtido:", resultado
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO: ${aprovados}/${testes.length}`);

if (aprovados !== testes.length) {
  process.exitCode = 1;
}
