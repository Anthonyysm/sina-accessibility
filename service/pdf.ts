import pdfParse from "pdf-parse";

const MAX_PDF_SIZE_MB = 10;
const MAX_PAGES = 50;

export interface PdfExtractResult {
  text: string;
  pages: number;
}

export async function extractTextFromPdf(
  buffer: Buffer
): Promise<PdfExtractResult> {
  if (buffer.length > MAX_PDF_SIZE_MB * 1024 * 1024) {
    throw new Error(`PDF excede o tamanho máximo de ${MAX_PDF_SIZE_MB}MB.`);
  }

  const data = await pdfParse(buffer, {
    max: MAX_PAGES,
    pagerender: renderPage,
  });

  const text = data.text.trim();

  if (!text) {
    throw new Error(
      "Não foi possível extrair texto deste PDF. O arquivo pode ser uma imagem escaneada. Use PDFs com texto selecionável."
    );
  }

  return {
    text,
    pages: data.numpages,
  };
}

interface TextContentItem {
  transform: number[];
  str: string;
}

interface TextContent {
  items: TextContentItem[];
}

interface PageData {
  getTextContent: (options: Record<string, unknown>) => Promise<TextContent>;
}

function renderPage(pageData: PageData) {
  const renderOptions: Record<string, unknown> = {
    normalizeWhitespace: true,
    disableCombineTextItems: false,
  };

  return pageData.getTextContent(renderOptions).then(function (textContent: TextContent) {
    let lastY: number | null = null;
    let text = "";
    for (const item of textContent.items) {
      if (lastY === null || Math.abs(item.transform[5] - lastY) > 2) {
        if (lastY !== null) text += "\n";
      } else {
        text += " ";
      }
      text += item.str;
      lastY = item.transform[5];
    }
    return text;
  });
}
