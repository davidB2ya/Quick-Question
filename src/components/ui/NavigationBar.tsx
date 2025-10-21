import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Plus, LogOut, ArrowLeft } from 'lucide-react';
import { Button } from './Button';

interface NavigationBarProps {
    showHome?: boolean;
    showCreateGame?: boolean;
    showBack?: boolean;
    showLeaveGame?: boolean;
    onLeaveGame?: () => void;
    backUrl?: string;
    title?: string;
    transparent?: boolean;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
    showHome = true,
    showCreateGame = false,
    showBack = false,
    showLeaveGame = false,
    onLeaveGame,
    backUrl,
    title,
    transparent = false,
}) => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    const handleCreateGame = () => {
        navigate('/create');
    };

    const handleGoBack = () => {
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    };

    const handleLeaveGame = () => {
        if (onLeaveGame) {
            onLeaveGame();
        } else {
            navigate('/');
        }
    };

    const bgClass = transparent
        ? 'bg-white/10 backdrop-blur-md border-b border-white/20'
        : 'bg-white shadow-md border-b border-gray-200';

    const textClass = transparent ? 'text-white' : 'text-gray-800';

    return (
        <nav className={`${bgClass} sticky top-0 z-50`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center gap-3">
                        {showBack && (
                            <Button
                                onClick={handleGoBack}
                                variant="ghost"
                                size="sm"
                                className={transparent ? 'flex items-center justify-center text-white hover:bg-white/20' : ''}
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Atrás
                            </Button>
                        )}

                        {title && (
                            <h1 className={`text-xl font-bold ${textClass}`}>
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Right side */}
                    <div className="flex items-center gap-2">
                        {showHome && (
                            <Button
                                onClick={handleGoHome}
                                variant="ghost"
                                size="sm"
                                className={transparent ? 'flex items-center justify-center text-white hover:bg-white/20' : 'flex items-center justify-center'}
                                title="Ir al inicio"
                            >
                                <Home className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Inicio</span>
                            </Button>
                        )}

                        {showCreateGame && (
                            <Button
                                onClick={handleCreateGame}
                                variant="ghost"
                                size="sm"
                                className={transparent ? 'flex items-center justify-center text-white hover:bg-white/20' : 'flex items-center justify-center'}
                                title="Crear nueva partida"
                            >
                                <Plus className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Nueva Partida</span>
                            </Button>
                        )}

                        {showLeaveGame && (
                            <Button
                                onClick={handleLeaveGame}
                                variant="ghost"
                                size="sm"
                                className="flex items-center justify-center text-red-600 hover:bg-red-50"
                                title="Salir del juego"
                            >
                                <LogOut className="w-4 h-4" />
                                <span className="hidden sm:inline ml-2">Salir</span>
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};
