#ifndef LED_H
#define LED_H

#include <Arduino.h>
#include <PubSubClient.h>
#include "config.h"

// ====== Pines ======
#define LED_PIN_SALA_A 45
#define LED_PIN_SALA_B 43
#define LED_PIN_COCINA 51
#define LED_PIN_DORMITORIO 49
#define LED_PIN_BANO 47
#define LED_PIN_GARAJE 53

// ====== Funciones ======
void setupLeds()
{
    pinMode(LED_PIN_SALA_A, OUTPUT);
    pinMode(LED_PIN_SALA_B, OUTPUT);
    pinMode(LED_PIN_COCINA, OUTPUT);
    pinMode(LED_PIN_DORMITORIO, OUTPUT);
    pinMode(LED_PIN_BANO, OUTPUT);
    pinMode(LED_PIN_GARAJE, OUTPUT);
}

// Maneja el on/off según mensaje MQTT
void handleLed(String message, int pin, PubSubClient &client, const char *stateTopic)
{
    if (message == "on")
        digitalWrite(pin, HIGH);
    else if (message == "off")
        digitalWrite(pin, LOW);

    // Publicar estado actual
    String state = digitalRead(pin) ? "on" : "off";
    client.publish(stateTopic, state.c_str());
}

#endif
