import { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layouts/MainLayout';

export default function WhatsAppSetupPage() {
  const [plannerName, setPlannerName] = useState('');
  const [sessionInfo, setSessionInfo] = useState({
    status: 'DISCONNECTED',
    qrCode: null,
    planner: null
  });
  const [loading, setLoading] = useState(false);

  // Consulta periódica al backend para mantener sincronizada la interfaz
  const checkStatus = async () => {
    try {
      const { data } = await axios.get('http://localhost:3000/api/whatsapp/status');
      setSessionInfo(data);
    } catch (err) {
      console.error('Error al consultar estado de WhatsApp:', err);
    }
  };

  useEffect(() => {
    checkStatus(); // Consulta inicial

    // Hacemos polling cada 3 segundos
    const interval = setInterval(() => {
      checkStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleStartShift = async () => {
    if (!plannerName.trim()) {
      return alert('Por favor, ingresá el nombre del Planner a cargo.');
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:3000/api/whatsapp/connect', { plannerName });
      await checkStatus();
    } catch (err) {
      alert('Error al intentar iniciar la conexión.');
    } finally {
      setLoading(false);
    }
  };

  const handleEndShift = async () => {
    try {
      await axios.post('http://localhost:3000/api/whatsapp/disconnect');
      setPlannerName('');
      await checkStatus();
    } catch (err) {
      alert('Error al cerrar la sesión.');
    }
  };

  return (
    <MainLayout>
      <div className="max-w-md mx-auto bg-white border rounded-xl p-6 shadow-sm mt-8">
        <h1 className="text-2xl font-bold mb-1">Jornada Planner Manager</h1>
        <p className="text-gray-500 text-sm mb-6">
          Vinculación de WhatsApp para control operativo de la jornada.
        </p>

        {sessionInfo.status === 'CONNECTED' ? (
          /* PANTALLA: SESIÓN ACTIVA */
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-2 text-green-800 font-bold">
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                WhatsApp Conectado
              </span>
              <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-md font-medium">
                {sessionInfo.planner}
              </span>
            </div>
            <p className="text-sm text-green-700 mb-5">
              El servicio está recibiendo y enviando mensajes con la cuenta vinculada.
            </p>
            <button
              onClick={handleEndShift}
              className="w-full bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-700 transition"
            >
              Cerrar Turno y Desconectar Celular
            </button>
          </div>
        ) : (
          /* PANTALLA: FORMULARIO + SCANNER QR */
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Planner a cargo del turno:
              </label>
              <input
                type="text"
                value={plannerName}
                onChange={(e) => setPlannerName(e.target.value)}
                placeholder="Ej: Martin - Turno Mañana"
                disabled={sessionInfo.status === 'INITIALIZING'}
                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            {sessionInfo.status === 'DISCONNECTED' && (
              <button
                onClick={handleStartShift}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Iniciando...' : 'Iniciar Turno y Generar QR'}
              </button>
            )}

            {sessionInfo.status === 'INITIALIZING' && (
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl bg-gray-50 mt-4">
                {sessionInfo.qrCode ? (
                  <>
                    <p className="text-xs text-gray-600 mb-4 text-center">
                      Abran WhatsApp en el celular corporativo &gt; **Dispositivos vinculados** &gt; **Vincular dispositivo**.
                    </p>
                    <img
                      src={sessionInfo.qrCode}
                      alt="Código QR de WhatsApp"
                      className="w-52 h-52 border rounded-lg bg-white p-2"
                    />
                  </>
                ) : (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-xs text-gray-500">Iniciando cliente de WhatsApp...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}