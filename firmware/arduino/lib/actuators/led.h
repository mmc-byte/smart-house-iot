#ifndef LED_H
#define LED_H

#include <Arduino.h>
#include <PubSubClient.h>

// Pines de LEDs
#define LED_PIN_SALA_A 2
#define LED_PIN_SALA_B 3
#define LED_PIN_DORMITORIO 4
#define LED_PIN_BANO 5
#define FAN_PIN 6

void setupLeds() {
  pinMode(LED_PIN_SALA_A, OUTPUT);
  pinMode(LED_PIN_SALA_B, OUTPUT);
  pinMode(LED_PIN_DORMITORIO, OUTPUT);
  pinMode(LED_PIN_BANO, OUTPUT);
  pinMode(FAN_PIN, OUTPUT);
}

// Maneja el estado de un LED y publica su nuevo estado
void handleLed(String message, int pin) {
  if (message == "ON") {
    digitalWrite(pin, HIGH);
  } else {
    digitalWrite(pin, LOW);
  }
}

#endif
