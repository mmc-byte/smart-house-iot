import json, time
import paho.mqtt.client as mqtt
from app.core.config import settings
from app.models.device import Device

#Version LAN ========================= 
# BROKER_HOST = "10.4.4.2"
# ====================================  


#Version LOCAL ========================
BROKER_HOST = "localhost" 
# ====================================  


BROKER_PORT = settings.BROKER_MQTT_PORT

client = mqtt.Client()

def on_connect(client, userdata, flags, rc):
    print(f"[MQTT] Connected with code {rc}")

client.on_connect = on_connect

def connect_mqtt():
    connected = False
    while not connected:
        try:
            client.connect(BROKER_HOST, BROKER_PORT, keepalive=60)
            client.loop_start()
            connected = True
            print("[MQTT] Connection established.")
        except Exception as e:
            print(f"[MQTT] Connection failed: {e}")
            time.sleep(3)

def publish_message(topic: str, payload: dict):
    if not client.is_connected():
        print("[MQTT] Client not connected. Reconnecting...")
        connect_mqtt()
    msg = json.dumps(payload)
    print(f"[MQTT] Publishing to {topic}: {msg}")
    client.publish(topic, msg)

    
latest_states = {}  # dict para guardar último estado recibido

def on_message(client, userdata, msg):
    try:
        payload = msg.payload.decode()
        latest_states[msg.topic] = payload
        print(f"[MQTT] Received {msg.topic}: {payload}")
    except Exception as e:
        print(f"[MQTT] Error handling message: {e}")

client.on_message = on_message

def subscribe_to_all_states(db):
    devices = db.query(Device).all()
    for d in devices:
        client.subscribe(d.state_topic)
        print(f"[MQTT] Subscribed to {d.state_topic}")
