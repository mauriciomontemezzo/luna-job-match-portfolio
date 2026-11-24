import {
  analisarSenioridade,
  type NivelSenioridade
} from "./analiseSenioridade";

export type EvidenciaSenioridadeV4 = {
  cargo: string;
  nivel: NivelSenioridade;
  motivo: string;
};

export type DiagnosticoSenioridadePerfilV4 = {
  situacao:
    | "identificada"
    | "multiplos_niveis"
    | "nao_confirmada";
  niveisIdentificados: NivelSenioridade[];
  evidencias: EvidenciaSenioridadeV4[];
  experimental: true;
  alteraPontuacao: false;
  alteraPrioridade: false;
};

export function analisarSenioridadePerfilV4(
  experiencias: unknown[]
): DiagnosticoSenioridadePerfilV4 {
  const evidencias: EvidenciaSenioridadeV4[] = [];

  for (const experiencia of experiencias) {
    if (
      !experiencia ||
      typeof experiencia !== "object" ||
      Array.isArray(experiencia)
    ) {
      continue;
    }

    const registro = experiencia as Record<string, unknown>;

    const cargo =
      typeof registro.cargo === "string"
        ? registro.cargo.trim()
        : "";

    if (!cargo) continue;

    const resultado = analisarSenioridade(cargo);

    evidencias.push({
      cargo,
      nivel: resultado.nivel,
      motivo: resultado.motivo
    });
  }

  const niveisIdentificados = Array.from(
    new Set(
      evidencias
        .map((item) => item.nivel)
        .filter(
          (nivel) => nivel !== "nao_identificada"
        )
    )
  );

  const situacao =
    niveisIdentificados.length === 0
      ? "nao_confirmada"
      : niveisIdentificados.length === 1
        ? "identificada"
        : "multiplos_niveis";

  return {
    situacao,
    niveisIdentificados,
    evidencias,
    experimental: true,
    alteraPontuacao: false,
    alteraPrioridade: false
  };
}
