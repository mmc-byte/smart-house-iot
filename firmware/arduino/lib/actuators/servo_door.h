#ifndef SERVO_DOOR_H
#define SERVO_DOOR_H

#include <Arduino.h>
#include <Servo.h>
#include <PubSubClient.h>
#include "config.h"

// ====== Pines ======
#define SERVO_PIN_PUERTA_PRINCIPAL 7
#define SERVO_PIN_PUERTA_GARAJE 8
#define LED_VERDE_PIN 9
#define LED_ROJO_PIN 10

Servo servoPrincipal;
Servo servoGaraje;

// ====== Inicialización ======
void setupServos()
{
    servoPrincipal.attach(SERVO_PIN_PUERTA_PRINCIPAL);
    servoGaraje.attach(SERVO_PIN_PUERTA_GARAJE);

    pinMode(LED_VERDE_PIN, OUTPUT);
    pinMode(LED_ROJO_PIN, OUTPUT);

    digitalWrite(LED_VERDE_PIN, LOW);
    digitalWrite(LED_ROJO_PIN, LOW);
}

// ====== Control manual por MQTT ======
void handleServoDoor(String message, int servoPin, PubSubClient &client, const char *stateTopic)
{
    Servo *servo = (servoPin == SERVO_PIN_PUERTA_PRINCIPAL) ? &servoPrincipal : &servoGaraje;

    if (message == "open")
        servo->write(90);
    else if (message == "close")
        servo->write(0);

    String state = (message == "open") ? "open" : "close";
    client.publish(stateTopic, state.c_str());
}

// ====== Control automático (por proximidad) ======
void autoDoorControl(bool objetoCercano, PubSubClient &client)
{
    if (objetoCercano)
    {
        servoGaraje.write(90);
        digitalWrite(LED_VERDE_PIN, HIGH);
        digitalWrite(LED_ROJO_PIN, LOW);
        client.publish(TOPIC_GARAJE_PUERTA_STATE, "open");
    }
    else
    {
        servoGaraje.write(0);
        digitalWrite(LED_VERDE_PIN, LOW);
        digitalWrite(LED_ROJO_PIN, HIGH);
        client.publish(TOPIC_GARAJE_PUERTA_STATE, "close");
    }
}

#endif
