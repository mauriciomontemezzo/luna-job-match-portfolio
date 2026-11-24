import assert from "node:assert/strict";

import {
  analisarSenioridadePerfilV4
} from "./senioridadePerfilV4";

let aprovados = 0;
let total = 0;

function verificar(
  nome: string,
  condicao: boolean
) {
  total++;

  if (condicao) {
    aprovados++;
    console.log("OK |", nome);
  } else {
    console.error("FALHOU |", nome);
    process.exitCode = 1;
  }
}

const vazio = analisarSenioridadePerfilV4([]);

verificar(
  "Aceita curriculo sem experiencias",
  vazio.situacao === "nao_confirmada" &&
  vazio.evidencias.length === 0
);

const junior = analisarSenioridadePerfilV4([
  { cargo: "Junior Python Developer" }
]);

verificar(
  "Identifica profissional Junior",
  junior.situacao === "identificada" &&
  junior.niveisIdentificados.includes("junior")
);

const senior = analisarSenioridadePerfilV4([
  { cargo: "Senior Software Engineer" }
]);

verificar(
  "Identifica profissional Senior",
  senior.situacao === "identificada" &&
  senior.niveisIdentificados.includes("senior")
);

const pleno = analisarSenioridadePerfilV4([
  { cargo: "Pleno Data Analyst" }
]);

verificar(
  "Identifica profissional Pleno",
  pleno.niveisIdentificados.includes("pleno")
);

const lideranca = analisarSenioridadePerfilV4([
  { cargo: "Engineering Manager" }
]);

verificar(
  "Identifica indicador de lideranca",
  lideranca.niveisIdentificados.includes("lideranca")
);

const desconhecido = analisarSenioridadePerfilV4([
  { cargo: "IT Support Technician" }
]);

verificar(
  "Nao inventa senioridade",
  desconhecido.situacao === "nao_confirmada" &&
  desconhecido.niveisIdentificados.length === 0
);

const multiplos = analisarSenioridadePerfilV4([
  { cargo: "Junior Python Developer" },
  { cargo: "Senior Software Engineer" }
]);

verificar(
  "Reconhece diferentes niveis no historico",
  multiplos.situacao === "multiplos_niveis" &&
  multiplos.niveisIdentificados.includes("junior") &&
  multiplos.niveisIdentificados.includes("senior")
);

const repetidos = analisarSenioridadePerfilV4([
  { cargo: "Junior Python Developer" },
  { cargo: "Junior Data Analyst" }
]);

verificar(
  "Nao duplica niveis identicos",
  repetidos.niveisIdentificados.length === 1 &&
  repetidos.evidencias.length === 2
);

const invalidos = analisarSenioridadePerfilV4([
  null,
  "",
  123,
  {},
  { cargo: "" },
  { cargo: 42 }
]);

verificar(
  "Ignora experiencias invalidas",
  invalidos.evidencias.length === 0 &&
  invalidos.situacao === "nao_confirmada"
);

const misto = analisarSenioridadePerfilV4([
  { cargo: "IT Support Technician" },
  { cargo: "Junior Python Developer" }
]);

verificar(
  "Preserva cargos sem nivel identificado",
  misto.evidencias.length === 2 &&
  misto.niveisIdentificados.length === 1
);

verificar(
  "Preserva natureza experimental",
  misto.experimental === true &&
  misto.alteraPontuacao === false &&
  misto.alteraPrioridade === false
);

assert.equal(
  aprovados,
  total,
  "Existem testes V4 que falharam."
);

console.log(
  `RESULTADO_SENIORIDADE_PERFIL_V4: ${aprovados}/${total}`
);
