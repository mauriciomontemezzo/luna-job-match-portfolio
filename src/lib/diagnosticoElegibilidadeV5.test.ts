import {
  diagnosticarElegibilidadeV5
} from "./diagnosticoElegibilidadeV5";

let aprovados = 0;
let falhas = 0;

function testar(
  descricao: string,
  condicao: boolean
) {
  if (condicao) {
    aprovados++;
    console.log("OK | " + descricao);
  } else {
    falhas++;
    console.error("FALHA | " + descricao);
  }
}

const junior = [
  { cargo: "Junior Python Developer" }
];

const senior = [
  { cargo: "Senior Python Developer" }
];

const caso1 = diagnosticarElegibilidadeV5(
  "Junior Python Developer",
  "Junior Python Developer",
  "Brazil",
  junior
);

testar(
  "Reconhece correspondencia profissional",
  caso1.relacaoProfissional === "direta"
);

testar(
  "Reconhece indicador de senioridade",
  caso1.situacaoSenioridade ===
    "indicio_correspondencia"
);

const caso2 = diagnosticarElegibilidadeV5(
  "Senior Python Developer",
  "Python Developer",
  "LATAM",
  junior
);

testar(
  "Identifica possivel diferenca de senioridade",
  caso2.situacaoSenioridade ===
    "possivel_diferenca"
);

const caso3 = diagnosticarElegibilidadeV5(
  "Senior Python Developer",
  "Senior Python Developer",
  "USA only",
  senior
);

testar(
  "Identifica restricao geografica explicita",
  caso3.situacaoGeografica ===
    "restricao_identificada"
);

const caso4 = diagnosticarElegibilidadeV5(
  "Data Engineer",
  "English Teacher",
  "Worldwide",
  []
);

testar(
  "Nao inventa correspondencia profissional",
  caso4.relacaoProfissional ===
    "nao_identificada"
);

const caso5 = diagnosticarElegibilidadeV5(
  "Python Developer",
  "Python Developer",
  "",
  []
);

testar(
  "Preserva senioridade nao confirmada",
  caso5.situacaoSenioridade ===
    "nao_confirmada"
);

const casos = [
  caso1,
  caso2,
  caso3,
  caso4,
  caso5
];

testar(
  "Nunca confirma elegibilidade automaticamente",
  casos.every(
    caso =>
      caso.elegibilidadeConfirmada === false &&
      caso.situacao === "revisao_necessaria"
  )
);

testar(
  "Nao altera pontuacao ou prioridade",
  casos.every(
    caso =>
      caso.alteraPontuacao === false &&
      caso.alteraPrioridade === false &&
      caso.experimental === true
  )
);

testar(
  "Exige verificacao de requisitos obrigatorios",
  casos.every(
    caso =>
      caso.pendencias.some(
        pendencia =>
          pendencia.includes(
            "Requisitos obrigatorios"
          )
      )
  )
);

console.log(
  "RESULTADO_ELEGIBILIDADE_V5: " +
  aprovados + "/" + (aprovados + falhas)
);

if (falhas > 0) {
  process.exitCode = 1;
}
