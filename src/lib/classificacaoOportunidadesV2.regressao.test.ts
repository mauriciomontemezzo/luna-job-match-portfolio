import {
  classificarOportunidadeV2
} from "./classificacaoOportunidadesV2";

const casos = [
  {
    vaga: "Content Reviewer",
    competencias: ["Python"],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Remote Office Assistant",
    competencias: ["Python"],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Senior Data Engineer",
    competencias: [],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Senior Data Engineer",
    competencias: ["SQL", "AWS"],
    esperado: "outras_oportunidades"
  },
  {
    vaga: "Senior Data Engineer",
    competencias: ["Python", "SQL"],
    esperado: "oportunidades_relacionadas"
  },
  {
    vaga: "Senior Back-end Developer",
    competencias: ["Python"],
    esperado: "oportunidades_relacionadas"
  },
  {
    vaga: "Python Engineer",
    competencias: [],
    esperado: "correspondencia_identificada"
  },
  {
    vaga: "React Developer",
    competencias: ["JavaScript", "React"],
    esperado: "outras_oportunidades"
  }
] as const;

let aprovados = 0;

for (const caso of casos) {
  const obtido = classificarOportunidadeV2(
    caso.vaga,
    "Python Developer",
    [...caso.competencias]
  );

  const passou = obtido === caso.esperado;

  console.log(
    passou ? "OK" : "FALHOU",
    "|", caso.vaga,
    "| esperado:", caso.esperado,
    "| obtido:", obtido
  );

  if (passou) aprovados++;
}

console.log(`RESULTADO_REGRESSAO: ${aprovados}/${casos.length}`);

if (aprovados !== casos.length) {
  process.exitCode = 1;
}
