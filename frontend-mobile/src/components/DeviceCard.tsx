import React, { useState, useEffect } from "react";
import { IonToggle, IonSpinner } from "@ionic/react";
import { motion } from "framer-motion";
import { Lightbulb, Thermometer, Camera, DoorClosed } from "lucide-react";
import { getDeviceState, sendDeviceCommand } from "../services/mqttService";

interface DeviceCardProps {
  device: {
    id: number;
    name: string;
    type: string;
  };
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  // Estado del dispositivo (por defecto "off" hasta saber su estado real)
  const [state, setState] = useState<"on" | "off">("off");

  // Estado de carga: evita que el usuario interactúe mientras hay una solicitud activa
  const [loading, setLoading] = useState(false);

  // Sincroniza estado actual del device
  useEffect(() => {
    const fetchInitialState = async () => {
      try {
        setLoading(true);
        const result = await getDeviceState(device.id);
        console.log("DEBUG | getDeviceState() devolvió:", result);

        const normalizedState =
          result?.state?.toLowerCase() === "on" ? "on" : "off";

        setState(normalizedState);
      } catch (err) {
        console.error("Error al obtener el estado del dispositivo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialState();
  }, [device.id]); 

  // Maneja el cambio manual del toggle (on/off)
  const handleToggle = async (e: CustomEvent) => {
    const newState = e.detail.checked ? "on" : "off";
    setLoading(true);

    try {
      await sendDeviceCommand(device.id, newState); //pub
      const result = await getDeviceState(device.id); //sub
      const normalizedState =
        result?.state?.toLowerCase() === "on" ? "on" : "off";

      // Actualiza estado en UI
      setState(normalizedState);
    } catch (err) {
      console.error("Error al actualizar dispositivo:", err);
    } finally {
      setLoading(false);
    }
  };

  // Ícono según el tipo de dispositivo
  const renderIcon = () => {
    switch (device.type) {
      case "led":
        return (
          <Lightbulb
            size={32}
            className={state === "on" ? "text-yellow-400" : "text-gray-400"}
          />
        );
      case "servomotor":
        return <DoorClosed size={32} className="text-blue-400" />;
      case "camera":
        return <Camera size={32} className="text-indigo-400" />;
      default:
        return <Lightbulb size={32} className="text-gray-400" />;
    }
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between w-48"
      whileHover={{ scale: 1.03 }}
    >
      {renderIcon()}

      <h3 className="mt-2 text-lg font-semibold">{device.name}</h3>
      {/* <h4 className="mt-1 text-sm text-gray-600">{device.type}</h4> */}

      {/* Mostrar spinner mientras se carga el estado */}
      {loading ? (
        <IonSpinner name="dots" />
      ) : (
        <IonToggle
          checked={state === "on"}
          onIonChange={handleToggle}
          disabled={loading}
        />
      )}

      {/* Acción adicional para cámaras */}
      {device.type === "camera" && (
        <a
          href="#"
          className="mt-3 text-blue-500 text-sm hover:underline"
          onClick={(e) => e.preventDefault()}
        >
          Ver livestream
        </a>
      )}
    </motion.div>
  );
};

export default DeviceCard;
