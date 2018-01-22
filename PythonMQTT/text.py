import paho.mqtt.client as mqtt
import json
import time

MQTT_PORT = 2532
MQTT_TOPIC = "testMQTT"
MQTT_IP = "91.224.148.106"

file = open("horse.js","r")
client = mqtt.Client("Kilian")
client.connect(MQTT_IP,MQTT_PORT)
debut=time.time()
while len(file.read(1))>0:
	char = file.read(1)
	client.publish(MQTT_TOPIC,file.read(1))
fin = time.time()
print(fin-debut)
file.close()
