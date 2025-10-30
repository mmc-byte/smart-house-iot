#ifndef CONFIG_H
#define CONFIG_H

#include <ESP8266WiFi.h>

// ====== CONFIGURACIÓN WIFI =========

// SSID y contraseña de la red local
#define WIFI_SSID "smart-home-lan"
#define WIFI_PASSWORD "12345678A"

// IP estática del ESP8266 - Arduino
IPAddress local_ip(10, 4, 4, 3);
IPAddress gateway(10, 4, 4, 1);
IPAddress subnet(255, 255, 255, 0);

//======  CONFIGURACIÓN MQTT =========

#define MQTT_BROKER "10.4.4.2" // IP de la laptop
#define MQTT_PORT 1883
#define MQTT_CLIENT_ID "arduino_mega"

// MQTT TOPICS

// --- Global ---
// #define TOPIC_PUERTA_PRINCIPAL_SET "houses/1/puerta_principal/set"
// #define TOPIC_PUERTA_PRINCIPAL_STATE "houses/1/puerta_principal/state"

// --- Sala ---
#define TOPIC_SALA_LUZ_A_SET "houses/1/sala/luz_a/set"
#define TOPIC_SALA_LUZ_A_STATE "houses/1/sala/luz_a/state"

#define TOPIC_SALA_LUZ_B_SET "houses/1/sala/luz_b/set"
#define TOPIC_SALA_LUZ_B_STATE "houses/1/sala/luz_b/state"

// --- Cocina ---
#define TOPIC_COCINA_LUZ_SET "houses/1/cocina/luz/set"
#define TOPIC_COCINA_LUZ_STATE "houses/1/cocina/luz/state"

// --- Dormitorio ---
#define TOPIC_DORMITORIO_LUZ_SET "houses/1/dormitorio/luz/set"
#define TOPIC_DORMITORIO_LUZ_STATE "houses/1/dormitorio/luz/state"

// --- Baño ---
#define TOPIC_BANO_LUZ_SET "houses/1/bano/luz/set"
#define TOPIC_BANO_LUZ_STATE "houses/1/bano/luz/state"

// --- Garaje ---
// #define TOPIC_GARAJE_PUERTA_SET "houses/1/garaje/puerta_garaje/set"
// #define TOPIC_GARAJE_PUERTA_STATE "houses/1/garaje/puerta_garaje/state"

#endif
