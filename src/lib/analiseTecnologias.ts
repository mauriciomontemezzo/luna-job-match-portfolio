export type AnaliseTecnologias = {
  tecnologiasDesejadas: string[];
  encontradas: string[];
  naoIdentificadas: string[];
  totalEncontradas: number;
  totalDesejadas: number;
};

function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9+#.]+/g, " ")
    .replace(/\.(?=\s|$)/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extrairTexto(descricao: string): string {
  return descricao
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

export function analisarTecnologias(
  descricao: string,
  tecnologias: string
): AnaliseTecnologias {
  const desejadas = [
    ...new Set(
      tecnologias
        .split(/[,;\n]/)
        .map(item => item.trim())
        .filter(Boolean)
    )
  ];

  const texto = ` ${normalizar(extrairTexto(descricao))} `;

  const encontradas: string[] = [];
  const naoIdentificadas: string[] = [];

  for (const tecnologia of desejadas) {
    const termo = normalizar(tecnologia);

    if (termo && texto.includes(` ${termo} `)) {
      encontradas.push(tecnologia);
    } else {
      naoIdentificadas.push(tecnologia);
    }
  }

  return {
    tecnologiasDesejadas: desejadas,
    encontradas,
    naoIdentificadas,
    totalEncontradas: encontradas.length,
    totalDesejadas: desejadas.length
  };
}
