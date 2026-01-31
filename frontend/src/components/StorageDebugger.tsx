import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2, RefreshCw } from 'lucide-react';

interface StorageDebuggerProps {
    isVisible?: boolean;
}

const StorageDebugger: React.FC<StorageDebuggerProps> = ({ isVisible = false }) => {
    const [showDebugger, setShowDebugger] = useState(isVisible);
    const [storageData, setStorageData] = useState<{ [key: string]: string }>({});
    const [filter, setFilter] = useState('');

    // Fonction pour charger les données du localStorage
    const loadStorageData = () => {
        const data: { [key: string]: string } = {};
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key) {
                data[key] = localStorage.getItem(key) || '';
            }
        }
        setStorageData(data);
    };

    // Charger les données au montage et à chaque changement de visibilité
    useEffect(() => {
        if (showDebugger) {
            loadStorageData();
            // Actualiser toutes les 2 secondes
            const interval = setInterval(loadStorageData, 2000);
            return () => clearInterval(interval);
        }
    }, [showDebugger]);

    // Fonction pour supprimer une clé
    const removeKey = (key: string) => {
        localStorage.removeItem(key);
        loadStorageData();
    };

    // Fonction pour vider tout le localStorage
    const clearAllStorage = () => {
        if (confirm('Êtes-vous sûr de vouloir vider tout le localStorage ?')) {
            localStorage.clear();
            loadStorageData();
        }
    };

    // Filtrer les données selon le filtre de recherche
    const filteredData = Object.entries(storageData).filter(([key, value]) =>
        key.toLowerCase().includes(filter.toLowerCase()) ||
        value.toLowerCase().includes(filter.toLowerCase())
    );

    // Fonction pour formater la valeur (JSON prettify si possible)
    const formatValue = (value: string) => {
        try {
            const parsed = JSON.parse(value);
            return JSON.stringify(parsed, null, 2);
        } catch {
            return value;
        }
    };

    if (!showDebugger) {
        return (
            <div className="fixed bottom-4 right-4 z-50">
                <button
                    onClick={() => setShowDebugger(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                    title="Afficher le débogueur de stockage"
                >
                    <Eye className="w-5 h-5" />
                </button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50 bg-white border border-gray-300 rounded-lg shadow-xl w-96 max-h-96 overflow-hidden">
            {/* En-tête */}
            <div className="bg-blue-600 text-white p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    <span className="font-semibold">Débogueur localStorage</span>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={loadStorageData}
                        className="p-1 hover:bg-blue-700 rounded transition-colors"
                        title="Actualiser"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button
                        onClick={clearAllStorage}
                        className="p-1 hover:bg-red-600 rounded transition-colors"
                        title="Vider le localStorage"
                    >
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setShowDebugger(false)}
                        className="p-1 hover:bg-blue-700 rounded transition-colors"
                        title="Fermer"
                    >
                        <EyeOff className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Filtre */}
            <div className="p-3 border-b border-gray-200">
                <input
                    type="text"
                    placeholder="Filtrer par clé ou valeur..."
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {/* Contenu */}
            <div className="overflow-y-auto max-h-64">
                {filteredData.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                        {filter ? 'Aucun résultat pour ce filtre' : 'Aucune donnée dans le localStorage'}
                    </div>
                ) : (
                    <div className="p-2">
                        {filteredData.map(([key, value]) => (
                            <div key={key} className="mb-3 p-2 bg-gray-50 rounded border">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-sm text-blue-600 truncate" title={key}>
                                        {key}
                                    </span>
                                    <button
                                        onClick={() => removeKey(key)}
                                        className="p-1 hover:bg-red-100 text-red-600 rounded transition-colors"
                                        title="Supprimer cette clé"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                                <div className="text-xs text-gray-600 bg-white p-2 rounded border overflow-x-auto">
                                    <pre className="whitespace-pre-wrap break-all">
                                        {formatValue(value)}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Statistiques */}
            <div className="bg-gray-100 p-2 text-xs text-gray-600 border-t">
                {filteredData.length} élément(s) • {Object.keys(storageData).length} total
            </div>
        </div>
    );
};

export default StorageDebugger;
