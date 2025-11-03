import React, { useState, useCallback, useEffect } from 'react';
import StockInputForm from './components/StockInputForm';
import PredictionDisplay from './components/PredictionDisplay';
import { predictStockPrice } from './services/geminiService';
import { Timeframe, StockPredictionResult } from './types';

function App() {
  const [predictionResult, setPredictionResult] = useState<StockPredictionResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Eliminar los estados currentSymbol y currentTimeframe
  // const [currentSymbol, setCurrentSymbol] = useState<string>(''); 
  // const [currentTimeframe, setCurrentTimeframe] = useState<Timeframe>(Timeframe.ONE_DAY); 

  // La app ahora asume que la clave API siempre se configura a través de process.env.API_KEY
  // y no se requiere interacción del usuario para seleccionarla.

  const handleSubmit = useCallback(
    async (symbol: string, timeframe: Timeframe, importantEvent: string, currentPrice?: number | null) => { // Añadir currentPrice
      setLoading(true);
      setError(null);
      setPredictionResult(null);
      // Eliminar actualización de currentSymbol y currentTimeframe
      // setCurrentSymbol(symbol); 
      // setCurrentTimeframe(timeframe); 

      try {
        const result = await predictStockPrice(symbol, timeframe, importantEvent, currentPrice); // Pasar currentPrice
        setPredictionResult(result);
      } catch (err) {
        console.error("Failed to fetch prediction:", err);
        const errorMessage = (err as Error).message || "Ha ocurrido un error inesperado al predecir el precio.";
        setError(errorMessage);

        // Si hay un error de clave API, sugerir verificar la configuración del entorno.
        if (errorMessage.includes("Requested entity was not found.") || errorMessage.includes("API key not valid")) {
          setError(errorMessage + " Por favor, asegúrate de que tu clave API (process.env.API_KEY) esté configurada correctamente en el entorno de despliegue.");
        }
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return (
    <div className="flex flex-col md:flex-row w-full h-full p-0 md:p-8">
      <div className="md:w-1/2 flex-shrink-0 md:h-full">
        <StockInputForm onSubmit={handleSubmit} loading={loading} />
      </div>
      <div className="md:w-1/2 md:pl-8 mt-8 md:mt-0 flex-grow md:h-full">
        <PredictionDisplay result={predictionResult} error={error} />
      </div>
    </div>
  );
}

export default App;