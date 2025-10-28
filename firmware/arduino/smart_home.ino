#include <ESP8266WiFi.h>
#include <PubSubClient.h>
#include "config.h"

// Librerías de control personalizadas
#include "lib/led.h"
#include "lib/servo_door.h"
#include "lib/proximity.h"

// Objetos WiFi y MQTT
WiFiClient espClient;
PubSubClient client(espClient);

// Función para conectar a WiFi con IP estática
void setupWiFi()
{
    WiFi.mode(WIFI_STA);
    WiFi.config(local_ip, gateway, subnet);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

    Serial.print("Conectando a WiFi ");
    Serial.print(WIFI_SSID);
    while (WiFi.status() != WL_CONNECTED)
    {
        delay(1000);
        Serial.print(".");
    }

    Serial.println();
    Serial.println("✅ WiFi conectado!");
    Serial.print("📡 IP asignada: ");
    Serial.println(WiFi.localIP());
}

// Callback MQTT: recibe mensajes de los topics suscritos
void callback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (int i = 0; i < length; i++)
        message += (char)payload[i];

    Serial.print("📩 Mensaje recibido en ");
    Serial.print(topic);
    Serial.print(": ");
    Serial.println(message);

    // ====== Acciones según topic ======
    if (String(topic) == TOPIC_SUBSCRIBE_LUZ_A_SALA)
    {
        handleLed(message, LED_PIN_SALA_A);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_LUZ_B_SALA)
    {
        handleLed(message, LED_PIN_SALA_B);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_LUZ_DORMITORIO)
    {
        handleLed(message, LED_PIN_DORMITORIO);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_LUZ_BANO)
    {
        handleLed(message, LED_PIN_BANO);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_PUERTA_PRINCIPAL)
    {
        handleServoDoor(message, SERVO_PIN_PUERTA_PRINCIPAL);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_PUERTA_GARAJE)
    {
        handleServoDoor(message, SERVO_PIN_PUERTA_GARAJE);
    }
    else if (String(topic) == TOPIC_SUBSCRIBE_VENTILADOR)
    {
        handleLed(message, FAN_PIN); // ejemplo: ventilador controlado como un LED
    }
}

//  Conexión al broker MQTT y suscripción a topics

void reconnectMQTT()
{
    while (!client.connected())
    {
        Serial.print("🔄 Conectando al broker MQTT...");
        if (client.connect(MQTT_CLIENT_ID))
        {
            Serial.println("✅ Conectado!");

            // Suscribirse a todos los topics definidos
            client.subscribe(TOPIC_SUBSCRIBE_PUERTA_PRINCIPAL);
            client.subscribe(TOPIC_SUBSCRIBE_VENTILADOR);
            client.subscribe(TOPIC_SUBSCRIBE_LUZ_A_SALA);
            client.subscribe(TOPIC_SUBSCRIBE_LUZ_B_SALA);
            client.subscribe(TOPIC_SUBSCRIBE_LUZ_DORMITORIO);
            client.subscribe(TOPIC_SUBSCRIBE_LUZ_BANO);
            client.subscribe(TOPIC_SUBSCRIBE_PUERTA_GARAJE);

            Serial.println("📡 Suscripción completa a todos los topics.");
        }
        else
        {
            Serial.print("❌ Error, rc=");
            Serial.print(client.state());
            Serial.println(" - Reintentando en 5 segundos...");
            delay(5000);
        }
    }
}

// ======================================================

void setup()
{
    Serial.begin(115200);
    setupWiFi();

    client.setServer(MQTT_SERVER, MQTT_PORT);
    client.setCallback(callback);

    // Inicializar actuadores y sensores
    setupLeds();
    setupServos();
    setupProximity();
}

void loop()
{
    if (!client.connected())
        reconnectMQTT();
    client.loop();

    // Comprobar sensor de proximidad del garaje
    checkProximity(client);
}
