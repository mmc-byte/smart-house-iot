import { sendDeviceCommand } from "../services/mqttService";

export default function MqttTestButton({ deviceId }: { deviceId: number }) {
  return (
    <button onClick={() => sendDeviceCommand(deviceId, "on")}>
      🔆 Encender dispositivo {deviceId}
    </button>
  );
}