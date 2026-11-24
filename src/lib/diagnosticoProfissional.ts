import { compararAnalisesProfissionais } from "./comparadorProfissional";

export type DiagnosticoProfissional = {
  classificacaoAtual: "direta" | "parcial" | "nao_identificada";
  situacao: "coerente" | "revisar";
  motivos: string[];
};

export function diagnosticarCompatibilidadeProfissional(
  cargoVaga: string,
  cargoDesejado: string
): DiagnosticoProfissional {
  const resultado = compararAnalisesProfissionais(
    cargoVaga,
    cargoDesejado
  );

  const classificacaoAtual =
    resultado.analiseAtual.relevancia;

  const funcoes =
    resultado.comparacao.funcoesEmComum.length;

  const especialidades =
    resultado.comparacao.especialidadesEmComum.length;

  const tecnologias =
    resultado.comparacao.tecnologiasEmComum.length;

  const motivos: string[] = [];

  if (
    classificacaoAtual === "nao_identificada" &&
    funcoes > 0 &&
    especialidades > 0
  ) {
    motivos.push(
      "Estrutura profissional semelhante sem correspondencia reconhecida."
    );
  }

  if (
    classificacaoAtual === "parcial" &&
    funcoes === 0 &&
    especialidades === 0 &&
    tecnologias === 0 &&
    !(
      ["Software Engineer", "Software Developer"].includes(cargoVaga) &&
      ["Software Engineer", "Software Developer"].includes(cargoDesejado)
    )
  ) {
    motivos.push(
      "Correspondencia parcial sem elementos estruturados em comum."
    );
  }

  if (
    classificacaoAtual === "direta" &&
    resultado.estruturaVaga.funcoes.length > 0 &&
    resultado.estruturaDesejada.funcoes.length > 0 &&
    funcoes === 0
  ) {
    motivos.push(
      "Correspondencia direta com funcoes profissionais diferentes."
    );
  }

  const tecnologiasVaga =
    resultado.estruturaVaga.tecnologias;

  const tecnologiasDesejadas =
    resultado.estruturaDesejada.tecnologias;

  if (
    funcoes > 0 &&
    especialidades > 0 &&
    tecnologiasVaga.length > 0 &&
    tecnologiasDesejadas.length > 0 &&
    tecnologias === 0
  ) {
    motivos.push(
      "Mesma funcao e especialidade, mas tecnologias diferentes."
    );
  }

  return {
    classificacaoAtual,
    situacao: motivos.length > 0
      ? "revisar"
      : "coerente",
    motivos
  };
}
