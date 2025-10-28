import React, { useState, useEffect } from "react"; // ← Importamos useEffect para sincronizar el estado inicial
import { IonToggle } from "@ionic/react";
import { motion } from "framer-motion";
import { Lightbulb, Thermometer, Camera } from "lucide-react";
import { getDeviceState, sendDeviceCommand } from "../services/mqttService";

interface DeviceCardProps {
  device: {
    id: number;
    name: string;
    type: string;
  };
  environment?: "local" | "lan";
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device, environment = "local" }) => {
  // version LAN ^^^ arriba NO cambiar, dejarlo en 'local' 

  // Para guardar o cambiar el estado
  const [state, setState] = useState<"on" | "off">("off");
  //Si está cargando se usa para desactivar el toggle más abajo
  const [loading, setLoading] = useState(false);

  //  Sincronización inicial- Se ejecuta solo al montar el componente
  useEffect(() => {
    const fetchInitialState = async () => {
      if (environment !== "lan") return; // version LAN : cambiar !== "local"
      try {
        setLoading(true); 
        console.log(`Fetching initial state for device ${device.id}...`);
        const result = await getDeviceState(device.id);
         // Si no hay respuesta, que sea "off" por defecto
        setState(result.state || "off");
     } catch (err) {
        console.error("Error fetching device state:", err);
      } finally {
        setLoading(false); // Reactivar interacción con el toggle
      }
    };

    fetchInitialState();
  }, []); //por ahora así, más simple
  // }, [device.id, environment]); // Si cambia o el entorno, se vuelve a sincronizar


  // El botón para enviar on o off
  const handleToggle = async (e: CustomEvent) => {
    const newState = e.detail.checked ? "on" : "off";
    setLoading(true);

    try {
      if (environment === "lan") {
        await sendDeviceCommand(device.id, newState);
        console.log("Sending command:", newState);

        const result = await getDeviceState(device.id);
        console.log("Updated device state:", result);

        setState(result.state || newState);
      } else {
        // En entorno local, simulamos el cambio de estado con un retraso
        setTimeout(() => setState(newState), 500);
      }
    } catch (err) {
      console.error("Error updating device:", err);
    } finally {
      setLoading(false);
    }
  };

  // Aquí los de frontend: ponle un ícono según el type de device
  const renderIcon = () => {
    switch (device.type) {
      case "led":
        return (
          <Lightbulb
            size={32}
            className={state === "on" ? "text-yellow-400" : "text-gray-400"}
          />
        );
      case "sensor":
        return <Thermometer size={32} className="text-blue-400" />;
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
      <h4 className="mt-2 text-lg font-semibold"> {device.type} </h4>

      {/* Se desactiva si loading está en true */}
      <IonToggle
        checked={state === "on"}
        onIonChange={handleToggle}
        disabled={loading}
      />

      {/* La cámara mostrará link para ver el livestream */}
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

// import React, { useState } from "react";
// import { IonToggle } from "@ionic/react";
// import { motion } from "framer-motion";
// import { Lightbulb, Thermometer, Camera } from "lucide-react";
// import { getDeviceState, sendDeviceCommand } from "../services/mqttService";

// interface DeviceCardProps {
//   device: {
//     id: number;
//     name: string;
//     type: string;
//   };
//   environment?: "local" | "lan";
// }

// const DeviceCard: React.FC<DeviceCardProps> = ({ device, environment = "local" }) => {
//     // version LAN : arriba cambiar "local" por "lan" (arriba)  ^^^^ 
//   const [state, setState] = useState<"on" | "off">("off");
//   const [loading, setLoading] = useState(false);

//   const handleToggle = async (e: CustomEvent) => {
//     const newState = e.detail.checked ? "on" : "off";
//     setLoading(true); // que sepa que procesa un cambio de estado y desactive el toggle mientras tanto.

//     try {
//       if (environment === "lan") {
//         await sendDeviceCommand(device.id, newState);
//         console.log('Sending command: ', newState);
//         const result = await getDeviceState(device.id);
//         console.log('Getting new state');
//         console.log(result);
//         setState(result.state || newState);
//       } else {
//         setTimeout(() => setState(newState), 500);
//       }
//     } catch (err) {
//       console.error("Error updating device:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const renderIcon = () => {
//     switch (device.type) {
//       case "led": return <Lightbulb size={32} className={state === "on" ? "text-yellow-400" : "text-gray-400"} />;
//       case "sensor": return <Thermometer size={32} className="text-blue-400" />;
//       case "camera": return <Camera size={32} className="text-indigo-400" />;
//       default: return <Lightbulb size={32} className="text-gray-400" />;
//     }
//   };

//   return (
//     <motion.div
//       className="bg-white rounded-2xl shadow-md p-4 flex flex-col items-center justify-between w-48"
//       whileHover={{ scale: 1.03 }}
//     >
//       {renderIcon()}
//       <h3 className="mt-2 text-lg font-semibold">{device.name}</h3>
//       <p className="text-sm text-gray-500 mb-2">Estado: {loading ? "..." : state}</p>

//       <IonToggle
//         checked={state === "on"}
//         onIonChange={handleToggle}
//         disabled={loading} //aquí desactiva el toggle mientra el mqtt está cargando.
//       />

//       {device.type === "camera" && (
//         <a
//           href="#"
//           className="mt-3 text-blue-500 text-sm hover:underline"
//           onClick={(e) => e.preventDefault()}
//         >
//           Ver livestream
//         </a>
//       )}
//     </motion.div>
//   );
// };
// export default DeviceCard;