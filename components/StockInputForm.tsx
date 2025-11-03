
import React, { useState } from 'react';
import { Timeframe } from '../types';
import Button from './Button';

interface StockInputFormProps {
  onSubmit: (symbol: string, timeframe: Timeframe, importantEvent: string, currentPrice?: number | null) => void;
  loading: boolean;
}

const timeframeOptions = [
  { value: Timeframe.FIVE_MIN, label: '5 Minutos' },
  { value: Timeframe.FIFTEEN_MIN, label: '15 Minutos' },
  { value: Timeframe.THIRTY_MIN, label: '30 Minutos' },
  { value: Timeframe.ONE_HOUR, label: '1 Hora' },
  { value: Timeframe.ONE_DAY, label: '1 Día' },
  { value: Timeframe.ONE_WEEK, label: '1 Semana' },
  { value: Timeframe.ONE_MONTH, label: '1 Mes' },
  { value: Timeframe.THREE_MONTHS, label: '3 Meses' },
  { value: Timeframe.SIX_MONTHS, label: '6 Meses' },
  { value: Timeframe.ONE_YEAR, label: '1 Año' },
];

const StockInputForm: React.FC<StockInputFormProps> = ({ onSubmit, loading }) => {
  const [symbol, setSymbol] = useState<string>('');
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.ONE_DAY);
  const [importantEvent, setImportantEvent] = useState<string>('');
  const [currentPrice, setCurrentPrice] = useState<string>(''); // Nuevo estado para el precio actual
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    if (!symbol.trim()) {
      setError('Por favor, introduce un símbolo bursátil.');
      return;
    }

    const parsedCurrentPrice = currentPrice.trim() === '' ? null : parseFloat(currentPrice);
    if (parsedCurrentPrice !== null && isNaN(parsedCurrentPrice)) {
      setError('Por favor, introduce un número válido para el precio actual.');
      return;
    }

    onSubmit(symbol.trim().toUpperCase(), timeframe, importantEvent.trim(), parsedCurrentPrice);
  };

  return (
    <div className="w-full p-6 sm:p-8 lg:p-10 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Mercado Futuro AI</h2>
      <p className="text-gray-600 mb-8 text-center">
        Introduce un símbolo bursátil, selecciona un marco temporal y añade cualquier evento relevante para predecir el próximo movimiento del precio. Si lo deseas, puedes proporcionar un precio actual para una proyección más específica.
      </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="symbol" className="block text-sm font-medium text-gray-700 mb-2">
            Símbolo Bursátil (Ej: AAPL)
          </label>
          <input
            type="text"
            id="symbol"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400 text-white bg-gray-800"
            placeholder="Introduce el símbolo"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="currentPrice" className="block text-sm font-medium text-gray-700 mb-2">
            Precio Actual (Opcional)
          </label>
          <input
            type="number"
            id="currentPrice"
            value={currentPrice}
            onChange={(e) => setCurrentPrice(e.target.value)}
            className="w-full px-4 py-3 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out placeholder-gray-400 text-white bg-gray-800"
            placeholder="Ej: 150.75"
            step="0.01"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-2">
            Marco Temporal
          </label>
          <select
            id="timeframe"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as Timeframe)}
            className="w-full px-4 py-3 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out text-white bg-gray-800"
            disabled={loading}
          >
            {timeframeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="event" className="block text-sm font-medium text-gray-700 mb-2">
            Evento Importante (Opcional)
          </label>
          <textarea
            id="event"
            value={importantEvent}
            onChange={(e) => setImportantEvent(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-700 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out resize-y placeholder-gray-400 text-white bg-gray-800"
            placeholder="Ej: Anuncio de resultados trimestrales inesperados, cambio en la política monetaria, etc."
            disabled={loading}
          ></textarea>
        </div>

        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}

        <Button type="submit" fullWidth loading={loading}>
          Predecir Movimiento
        </Button>
      </form>
    </div>
  );
};

export default StockInputForm;