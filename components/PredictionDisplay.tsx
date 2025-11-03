import React from 'react';
import { StockPredictionResult, Prediction, Suggestion } from '../types';
// Eliminar la importación del gráfico de velas: import StockCandlestickChart from './StockCandlestickChart'; 
// Eliminar la importación de Timeframe: import { Timeframe } from '../types'; 

interface PredictionDisplayProps {
  result: StockPredictionResult | null;
  error: string | null;
  // Eliminar props de symbol y timeframe: symbol: string; timeframe: Timeframe;
}

const getBackgroundColorClass = (prediction: Prediction) => {
  switch (prediction) {
    case 'Up':
      return 'bg-green-500';
    case 'Down':
      return 'bg-red-500';
    case 'Stable':
      return 'bg-blue-500';
  }
};

const getArrowSVG = (prediction: Prediction) => {
  const svgClasses = "w-16 h-16 text-white";
  switch (prediction) {
    case 'Up':
      return (
        <svg className={svgClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 18a.75.75 0 01-.75-.75V4.66L5.47 8.47a.75.75 0 01-1.06-1.06l4.25-4.25a.75.75 0 011.06 0l4.25 4.25a.75.75 0 01-1.06 1.06L10.75 4.66V17.25a.75.75 0 01-.75.75z" clipRule="evenodd" />
        </svg>
      );
    case 'Down':
      return (
        <svg className={svgClasses} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
          <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v12.59l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 011.06-1.06l3.72 3.72V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
        </svg>
      );
    case 'Stable':
      return (
        <svg className={svgClasses} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zM12 16a.75.75 0 00-.75.75.75.75 0 001.5 0 .75.75 0 00-.75-.75z" clipRule="evenodd" />
        </svg>
      );
  }
};

// Componente StockTrendChart reintroducido
const StockTrendChart: React.FC<{ prediction: Prediction }> = ({ prediction }) => {
  const lineColorClass = {
    'Up': 'stroke-green-500',
    'Down': 'stroke-red-500',
    'Stable': 'stroke-blue-500',
  }[prediction];

  const pathD = {
    'Up': "M10 50 Q 50 20, 90 50", // Gentle upward curve
    'Down': "M10 50 Q 50 80, 90 50", // Gentle downward curve
    'Stable': "M10 50 Q 30 45, 50 50 Q 70 55, 90 50", // Wavy line for stable
  }[prediction];

  return (
    <div className="relative w-full h-40 mb-6 p-4 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center" aria-label={`Gráfico de tendencia conceptual: ${prediction === 'Up' ? 'Alza' : prediction === 'Down' ? 'Baja' : 'Estable'}`}>
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d={pathD} fill="none" className={`${lineColorClass} stroke-2`} />
      </svg>
    </div>
  );
};


const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ result, error /*, symbol, timeframe */ }) => {
  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mt-8 w-full max-w-2xl mx-auto shadow-md" role="alert">
        <p className="font-bold">Error:</p>
        <p>{error}</p>
        <p className="mt-2 text-sm">Si el error indica que la "Requested entity was not found." o "API key not valid", por favor asegúrate de que tu clave API (process.env.API_KEY) esté configurada correctamente en el entorno donde despliegas la aplicación.</p>
        <p className="text-sm">Si el problema persiste, intenta recargar la página o contacta al soporte.</p>
      </div>
    );
  }

  if (!result) {
    return null; // Don't render anything if no result or error
  }

  let predictionColor = '';
  switch (result.prediction) {
    case 'Up':
      predictionColor = 'text-green-600';
      break;
    case 'Down':
      predictionColor = 'text-red-600';
      break;
    case 'Stable':
      predictionColor = 'text-blue-600';
      break;
  }

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10 bg-white rounded-lg shadow-lg mt-8 md:mt-0 md:ml-8" aria-live="polite">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Resultado de la Predicción</h2>

      <div className="mb-6 border-b pb-4 flex flex-col items-center">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Predicción:</h3>
        <div className={`w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 ${getBackgroundColorClass(result.prediction)}`}>
          {getArrowSVG(result.prediction)}
        </div>
        <p className={`text-3xl font-bold mt-4 ${predictionColor}`} aria-label={`Predicción: ${result.prediction === 'Up' ? 'Alza' : result.prediction === 'Down' ? 'Baja' : 'Estable'}`}>
          {result.prediction === 'Up' ? 'Alza' : result.prediction === 'Down' ? 'Baja' : 'Estable'}
        </p>
      </div>

      {result.prediction && (
        <>
          <h3 className="text-xl font-semibold text-gray-700 mb-2 mt-8 text-center">Gráfico de Tendencia Conceptual:</h3>
          <StockTrendChart prediction={result.prediction} />
          <p className="text-sm text-gray-500 mt-4 text-center">
            *Este gráfico es una representación conceptual de la tendencia de la predicción y no muestra datos históricos reales ni análisis de velas.
          </p>
        </>
      )}

      {result.suggestion && ( // Conditionally render suggestion
        <div className="mb-6 border-b pb-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Sugerencia para el Inversor:</h3>
          <p className="text-2xl font-bold text-blue-700" aria-label={`Sugerencia: ${result.suggestion}`}>
            {result.suggestion}
          </p>
        </div>
      )}

      {result.projectedPrice && ( // Nuevo bloque para mostrar el precio proyectado
        <div className="mb-6 border-b pb-4 text-center">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Precio Proyectado:</h3>
          <p className="text-2xl font-bold text-indigo-700" aria-label={`Precio proyectado: ${result.projectedPrice}`}>
            {result.projectedPrice}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            *Proyección basada en el análisis de la IA y el precio actual proporcionado (si aplica).
          </p>
        </div>
      )}

      <div className="mb-6 border-b pb-4">
        <h3 className="text-xl font-semibold text-gray-700 mb-2">Razonamiento:</h3>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{result.reasoning}</p>
      </div>

      {result.groundingUrls && result.groundingUrls.length > 0 && (
        <div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Fuentes Adicionales:</h3>
          <ul className="list-disc list-inside text-gray-600 space-y-1">
            {result.groundingUrls.map((chunk, index) => (
              <li key={index}>
                { 'web' in chunk && (
                    <a
                      href={chunk.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {chunk.web.title || chunk.web.uri}
                    </a>
                )}
                 { 'maps' in chunk && (
                    <a
                      href={chunk.maps.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {chunk.maps.title || chunk.maps.uri} (Maps)
                    </a>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PredictionDisplay;