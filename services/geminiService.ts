import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Timeframe, StockPredictionResult, Prediction, GroundingChunk, Suggestion } from "../types";

export const predictStockPrice = async (
  symbol: string,
  timeframe: Timeframe,
  importantEvent: string,
  currentPrice?: number | null, // Nuevo parámetro
): Promise<StockPredictionResult> => {
  // CRITICAL: Create a new GoogleGenAI instance right before making an API call
  // to ensure it always uses the most up-to-date API key from the dialog.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  // Fix: Use ai.models.generateContent directly with the model specified.
  // The 'getGenerativeModel' method is deprecated and should not be used.

  let prompt = `Eres un analista financiero experto con sólidos conocimientos en análisis técnico y fundamental.
Tu tarea es predecir el próximo movimiento del precio para la acción "${symbol}" en el marco temporal de "${timeframe}".

Realiza un análisis técnico simulado para esta acción, considerando:
- Tendencias de precios recientes y patrones gráficos.
- Indicadores clave como RSI, MACD, volumen de negociación, y medias móviles.
- Cualquier noticia relevante o movimientos de precios significativos recientes (como rallies alcistas o caídas) que puedas encontrar utilizando tu herramienta de búsqueda.
${currentPrice ? `
Si se proporciona un "Precio Actual" (Manual) de ${currentPrice}, utilízalo como punto de partida para tu análisis.
` : ''}
Además, integra el siguiente evento importante proporcionado por el usuario, que podría influir en el precio:
"${importantEvent || 'Ningún evento adicional significativo.'}"

Basándote en este análisis técnico simulado, ${currentPrice ? 'el precio actual proporcionado,' : ''} y el evento importante, predice el próximo movimiento del precio como 'Up' (al alza), 'Down' (a la baja) o 'Stable' (estable).
Justifica tu predicción con un razonamiento conciso y profesional. Asegúrate de que tu razonamiento sea consistente con el análisis técnico y el impacto potencial del evento. Si el evento es muy fuerte y contradice la lógica del análisis técnico, explica claramente por qué lo ha anulado.

Finalmente, basándote en todo el análisis y la predicción, proporciona una sugerencia concreta para el inversor: 'Compra Moderada', 'Mantener' o 'Vender'.
${currentPrice ? `
Además, proyecta un precio objetivo o un rango de precios para la acción "${symbol}" al final del marco temporal de "${timeframe}". Si no es posible dar un precio específico o un rango, indica "No se puede determinar" y explica brevemente por qué.
` : ''}
Formato de respuesta deseado (solo el texto de la predicción, razonamiento, sugerencia ${currentPrice ? 'y precio proyectado' : ''}):
Predicción: [Up/Down/Stable]
Razonamiento: [Tu justificación detallada aquí]
Sugerencia: [Compra Moderada/Mantener/Vender]
${currentPrice ? 'Precio Proyectado: [Valor, Rango o "No se puede determinar" con explicación]' : ''}
`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Specify the model directly
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        tools: [{ googleSearch: {} }], // Enable Google Search for up-to-date information
      },
    });

    const fullText = response.text;
    
    // Parse the prediction and reasoning from the text
    const predictionMatch = fullText.match(/Predicción:\s*(Up|Down|Stable)/i);
    // Adjusted regex to capture reasoning before 'Sugerencia:' or end of string
    const reasoningMatch = fullText.match(/Razonamiento:\s*([\s\S]*?)(?=Sugerencia:|$)/i);
    const suggestionMatch = fullText.match(/Sugerencia:\s*(Compra Moderada|Mantener|Vender)/i);
    const projectedPriceMatch = fullText.match(/Precio Proyectado:\s*([\s\S]*)/i); // Nuevo regex para precio proyectado

    const prediction: Prediction = predictionMatch
      ? (predictionMatch[1] as Prediction)
      : 'Stable'; // Default to Stable if parsing fails
    const reasoning = reasoningMatch ? reasoningMatch[1].trim() : fullText.trim();
    const suggestion: Suggestion | undefined = suggestionMatch
      ? (suggestionMatch[1] as Suggestion)
      : undefined; // Default to undefined if parsing fails
    const projectedPrice: string | undefined = projectedPriceMatch
      ? projectedPriceMatch[1].trim()
      : undefined;

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    return {
      prediction,
      reasoning,
      suggestion, // Include suggestion in the result
      projectedPrice, // Incluir precio proyectado en el resultado
      groundingUrls: groundingChunks as GroundingChunk[],
    };
  } catch (error) {
    console.error("Error al predecir el precio de la acción:", error);
    throw new Error(
      `No se pudo obtener la predicción. ${
        (error as Error).message || "Un error desconocido ocurrió."
      }`
    );
  }
};