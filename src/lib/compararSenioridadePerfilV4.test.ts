import assert from "node:assert/strict";

import {
  compararSenioridadePerfilV4
} from "./compararSenioridadePerfilV4";

let aprovados = 0;
let total = 0;

function verificar(
  nome: string,
  condicao: boolean
) {
  total++;

  if (!condicao) {
    console.error("FALHOU |", nome);
    process.exitCode = 1;
    return;
  }

  aprovados++;
  console.log("OK |", nome);
}

const junior = compararSenioridadePerfilV4(
  "Junior Python Developer",
  [{ cargo: "Junior Software Developer" }]
);

verificar(
  "Junior com Junior",
  junior.situacao === "indicio_correspondencia"
);

const pleno = compararSenioridadePerfilV4(
  "Pleno Data Analyst",
  [{ cargo: "Mid-Level Data Analyst" }]
);

verificar(
  "Pleno com Pleno",
  pleno.situacao === "indicio_correspondencia"
);

const senior = compararSenioridadePerfilV4(
  "Senior Data Engineer",
  [{ cargo: "Senior Software Engineer" }]
);

verificar(
  "Senior com Senior",
  senior.situacao === "indicio_correspondencia"
);

const diferenca = compararSenioridadePerfilV4(
  "Senior Data Engineer",
  [{ cargo: "Junior Python Developer" }]
);

verificar(
  "Junior comparado com vaga Senior",
  diferenca.situacao === "possivel_diferenca"
);

const inverso = compararSenioridadePerfilV4(
  "Junior Developer",
  [{ cargo: "Senior Developer" }]
);

verificar(
  "Senior comparado com vaga Junior",
  inverso.situacao === "possivel_diferenca"
);

const semExperiencias = compararSenioridadePerfilV4(
  "Senior Data Engineer",
  []
);

verificar(
  "Curriculo sem experiencias",
  semExperiencias.situacao === "nao_confirmada"
);

const vagaDesconhecida = compararSenioridadePerfilV4(
  "Python Developer",
  [{ cargo: "Junior Python Developer" }]
);

verificar(
  "Vaga sem senioridade explicita",
  vagaDesconhecida.situacao === "nao_confirmada"
);

const historicoDesconhecido =
  compararSenioridadePerfilV4(
    "Senior Data Engineer",
    [{ cargo: "IT Support Technician" }]
  );

verificar(
  "Historico sem senioridade explicita",
  historicoDesconhecido.situacao === "nao_confirmada"
);

const historicoMisto =
  compararSenioridadePerfilV4(
    "Senior Data Engineer",
    [
      { cargo: "Junior Python Developer" },
      { cargo: "Senior Software Engineer" }
    ]
  );

verificar(
  "Nao presume senioridade em historico misto",
  historicoMisto.situacao === "nao_confirmada"
);

const lideranca = compararSenioridadePerfilV4(
  "Engineering Manager",
  [{ cargo: "Tech Lead Software Engineer" }]
);

verificar(
  "Reconhece indicadores de lideranca",
  lideranca.situacao === "indicio_correspondencia"
);

verificar(
  "Preserva indicadores do historico",
  historicoMisto.niveisHistorico.includes("junior") &&
  historicoMisto.niveisHistorico.includes("senior")
);

verificar(
  "Nao altera pontuacao ou prioridade",
  junior.experimental === true &&
  junior.alteraPontuacao === false &&
  junior.alteraPrioridade === false
);

assert.equal(
  aprovados,
  total,
  "Existem testes V4 que falharam."
);

console.log(
  `RESULTADO_COMPARADOR_V4: ${aprovados}/${total}`
);
