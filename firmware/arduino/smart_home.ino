#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// ====== Librerías custom (nuestras) ======
#include "config.h"
#include "led.h"
// #include "servo_door.h"
// #include "proximity.h"

// ====== Objetos WiFi y MQTT ======
WiFiClient espClient;
PubSubClient client(espClient);

// ====== Conexión WiFi con IP estática ======
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
    Serial.println("¡WiFi conectado!");
    Serial.print("IP asignada: ");
    Serial.println(WiFi.localIP());
}

// ====== Callback MQTT: recibe mensajes ======
void callback(char *topic, byte *payload, unsigned int length)
{
    String message;
    for (int i = 0; i < length; i++)
        message += (char)payload[i];

    Serial.print("Mensaje recibido en ");
    Serial.print(topic);
    Serial.print(": ");
    Serial.println(message);

    // ====== Acciones según topic ======
    if (String(topic) == TOPIC_SALA_LUZ_A_SET)
        handleLed(message, LED_PIN_SALA_A, client, TOPIC_SALA_LUZ_A_STATE);
    else if (String(topic) == TOPIC_SALA_LUZ_B_SET)
        handleLed(message, LED_PIN_SALA_B, client, TOPIC_SALA_LUZ_B_STATE);
    else if (String(topic) == TOPIC_COCINA_LUZ_SET)
        handleLed(message, LED_PIN_COCINA, client, TOPIC_COCINA_LUZ_STATE);
    else if (String(topic) == TOPIC_DORMITORIO_LUZ_SET)
        handleLed(message, LED_PIN_DORMITORIO, client, TOPIC_DORMITORIO_LUZ_STATE);
    else if (String(topic) == TOPIC_BANO_LUZ_SET)
        handleLed(message, LED_PIN_BANO, client, TOPIC_BANO_LUZ_STATE);
    // else if (String(topic) == TOPIC_PUERTA_PRINCIPAL_SET)
    //     handleServoDoor(message, SERVO_PIN_PUERTA_PRINCIPAL, client, TOPIC_PUERTA_PRINCIPAL_STATE);
    // else if (String(topic) == TOPIC_GARAJE_PUERTA_SET)
    //     handleServoDoor(message, SERVO_PIN_GARAJE, client, TOPIC_GARAJE_PUERTA_STATE);
    else
    {
        Serial.print("⚠️  Topic no reconocido: ");
        Serial.println(topic);
    }
}

// ====== Conexión al broker MQTT y suscripción ======
void reconnectMQTT()
{
    while (!client.connected())
    {
        Serial.print("Conectando al broker MQTT...");
        if (client.connect(MQTT_CLIENT_ID))
        {
            Serial.println("¡Conectado!");

            // Suscribirse a todos los topics "set"
            // client.subscribe(TOPIC_PUERTA_PRINCIPAL_SET);
            client.subscribe(TOPIC_SALA_LUZ_A_SET);
            client.subscribe(TOPIC_SALA_LUZ_B_SET);
            client.subscribe(TOPIC_COCINA_LUZ_SET);
            client.subscribe(TOPIC_DORMITORIO_LUZ_SET);
            client.subscribe(TOPIC_BANO_LUZ_SET);
            // client.subscribe(TOPIC_GARAJE_PUERTA_SET);

            Serial.println("Suscripción completa a todos los topics.");
        }
        else
        {
            Serial.print("Error, rc=");
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

    client.setServer(MQTT_BROKER, MQTT_PORT);
    client.setCallback(callback);

    // Inicializar actuadores y sensores
    setupLeds();
    // setupServos();
    // setupProximity();
}

void loop()
{
    if (!client.connected())
        reconnectMQTT();

    client.loop();

    // Comprobar sensor de proximidad del garaje
    // checkProximity(client);
}