import {
  avaliarOportunidadeV6
} from "./avaliacaoOportunidadeV6";

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

function avaliar(
  cargoVaga: string,
  cargosDesejados: string,
  localizacao: string,
  experiencias: unknown[]
) {
  return avaliarOportunidadeV6(
    diagnosticarElegibilidadeV5(
      cargoVaga,
      cargosDesejados,
      localizacao,
      experiencias
    )
  );
}

const favoravel = avaliar(
  "Junior Python Developer",
  "Junior Python Developer",
  "Brazil",
  [{ cargo: "Junior Python Developer" }]
);

testar(
  "Identifica indicadores favoraveis",
  favoravel.situacao === "indicios_favoraveis"
);

const latam = avaliar(
  "Junior Python Developer",
  "Junior Python Developer",
  "LATAM",
  [{ cargo: "Junior Python Developer" }]
);

testar(
  "Reconhece regiao LATAM com outros indicadores",
  latam.situacao === "indicios_favoraveis"
);

const senioridadeDiferente = avaliar(
  "Senior Python Developer",
  "Python Developer",
  "LATAM",
  [{ cargo: "Junior Python Developer" }]
);

testar(
  "Sinaliza diferenca de senioridade",
  senioridadeDiferente.situacao ===
    "alertas_relevantes"
);

const restricao = avaliar(
  "Senior Python Developer",
  "Senior Python Developer",
  "USA only",
  [{ cargo: "Senior Python Developer" }]
);

testar(
  "Sinaliza restricao geografica",
  restricao.situacao === "alertas_relevantes"
);

const semExperiencias = avaliar(
  "Python Developer",
  "Python Developer",
  "Brazil",
  []
);

testar(
  "Nao presume senioridade sem historico",
  semExperiencias.situacao ===
    "verificacao_necessaria"
);

const semLocalizacao = avaliar(
  "Junior Python Developer",
  "Junior Python Developer",
  "",
  [{ cargo: "Junior Python Developer" }]
);

testar(
  "Nao presume compatibilidade geografica",
  semLocalizacao.situacao ===
    "verificacao_necessaria"
);

const outraCarreira = avaliar(
  "Data Engineer",
  "English Teacher",
  "Worldwide",
  []
);

testar(
  "Nao presume correspondencia entre carreiras",
  outraCarreira.situacao ===
    "verificacao_necessaria"
);

const casos = [
  favoravel,
  latam,
  senioridadeDiferente,
  restricao,
  semExperiencias,
  semLocalizacao,
  outraCarreira
];

testar(
  "Nunca confirma elegibilidade automaticamente",
  casos.every(
    caso =>
      caso.elegibilidadeConfirmada === false
  )
);

testar(
  "Nao altera algoritmos existentes",
  casos.every(
    caso =>
      caso.alteraPontuacao === false &&
      caso.alteraPrioridade === false &&
      caso.alteraClassificacao === false &&
      caso.alteraOrdenacao === false
  )
);

testar(
  "Preserva natureza experimental",
  casos.every(
    caso => caso.experimental === true
  )
);

testar(
  "Fornece motivos em todas as avaliacoes",
  casos.every(
    caso => caso.motivos.length > 0
  )
);

console.log(
  "RESULTADO_AVALIACAO_V6: " +
  aprovados + "/" + (aprovados + falhas)
);

if (falhas > 0) {
  process.exitCode = 1;
}
