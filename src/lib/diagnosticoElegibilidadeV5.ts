import {
  analisarGeografia
} from "./analiseGeografica";

import {
  analisarCargo
} from "./compatibilidadeVagas";

import {
  compararSenioridadePerfilV4
} from "./compararSenioridadePerfilV4";

export type DiagnosticoElegibilidadeV5 = {
  situacao: "revisao_necessaria";
  relacaoProfissional:
    ReturnType<typeof analisarCargo>["relevancia"];
  situacaoGeografica:
    ReturnType<typeof analisarGeografia>["situacao"];
  situacaoSenioridade:
    ReturnType<
      typeof compararSenioridadePerfilV4
    >["situacao"];
  evidencias: string[];
  pendencias: string[];
  experimental: true;
  elegibilidadeConfirmada: false;
  alteraPontuacao: false;
  alteraPrioridade: false;
};

export function diagnosticarElegibilidadeV5(
  cargoVaga: string,
  cargosDesejados: string,
  localizacao: string,
  experiencias: unknown[]
): DiagnosticoElegibilidadeV5 {
  const cargo = analisarCargo(
    cargoVaga,
    cargosDesejados
  );

  const geografia = analisarGeografia(localizacao);

  const senioridade = compararSenioridadePerfilV4(
    cargoVaga,
    experiencias
  );

  const evidencias: string[] = [];
  const pendencias: string[] = [];

  if (cargo.relevancia === "direta") {
    evidencias.push(
      "Correspondencia profissional identificada."
    );
  } else if (cargo.relevancia === "parcial") {
    evidencias.push(
      "Relacao profissional parcial identificada."
    );
  } else {
    pendencias.push(
      "Correspondencia profissional nao identificada."
    );
  }

  if (
    geografia.situacao === "brasil_mencionado" ||
    geografia.situacao === "regiao_compativel" ||
    geografia.situacao === "global"
  ) {
    evidencias.push(geografia.motivo);
  } else {
    pendencias.push(geografia.motivo);
  }

  if (
    senioridade.situacao ===
    "indicio_correspondencia"
  ) {
    evidencias.push(
      "Indicador de senioridade correspondente."
    );
  } else {
    pendencias.push(senioridade.motivo);
  }

  pendencias.push(
    "Requisitos obrigatorios da vaga nao verificados."
  );

  pendencias.push(
    "Autorizacao de trabalho e elegibilidade contratual nao confirmadas."
  );

  return {
    situacao: "revisao_necessaria",
    relacaoProfissional: cargo.relevancia,
    situacaoGeografica: geografia.situacao,
    situacaoSenioridade: senioridade.situacao,
    evidencias,
    pendencias,
    experimental: true,
    elegibilidadeConfirmada: false,
    alteraPontuacao: false,
    alteraPrioridade: false
  };
}
