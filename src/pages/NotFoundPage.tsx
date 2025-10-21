import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-400 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <Card className="max-w-lg w-full text-center space-y-6">
        {/* 404 Icon */}
        <div className="flex justify-center">
          <div className="bg-gradient-to-br from-primary-100 to-purple-100 rounded-full p-8">
            <Search className="w-24 h-24 text-primary-600" />
          </div>
        </div>

        {/* Title */}
        <div>
          <h1 className="text-6xl font-extrabold text-gray-800 mb-2">404</h1>
          <h2 className="text-3xl font-bold text-gray-700 mb-4">
            Página No Encontrada
          </h2>
          <p className="text-gray-600 text-lg">
            ¡Oops! Parece que te perdiste en el juego. 
            La página que buscas no existe o fue movida.
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => navigate('/')}
            className="flex items-center justify-center w-full"
            size="lg"
          >
            <Home className="w-5 h-5 mr-2" />
            Ir al Inicio
          </Button>

          <Button
            onClick={() => navigate('/create')}
            variant="secondary"
            className="flex items-center justify-center w-full"
            size="lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Nueva Partida
          </Button>
        </div>

        {/* Help text */}
        <div className="pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            ¿Estabas buscando una partida específica?<br />
            Ve al inicio e ingresa el código de la sala.
          </p>
        </div>
      </Card>
    </div>
  );
};
