#ifndef PROXIMITY_H
#define PROXIMITY_H

#include <Arduino.h>
#include <PubSubClient.h>
#include "servo_door.h"

// ====== Pines ======
#define TRIG_PIN 11
#define ECHO_PIN 12

void setupProximity()
{
    pinMode(TRIG_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
}

// Devuelve true si hay algo cerca (< 20 cm)
bool detectObject()
{
    digitalWrite(TRIG_PIN, LOW);
    delayMicroseconds(2);
    digitalWrite(TRIG_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIG_PIN, LOW);

    long duration = pulseIn(ECHO_PIN, HIGH);
    int distance = duration * 0.034 / 2;
    return (distance < 20);
}

// Chequea periódicamente la distancia
void checkProximity(PubSubClient &client)
{
    bool cerca = detectObject();
    autoDoorControl(cerca, client);
}

#endif
