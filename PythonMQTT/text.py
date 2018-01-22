import paho.mqtt.client as mqtt
import json
import time

MQTT_PORT = 2532
MQTT_TOPIC = "JSONtemplate"
MQTT_IP = "91.224.148.106"

file = open("horse.js","r")
client = mqtt.Client("Kilian")
client.connect(MQTT_IP,MQTT_PORT)
debut=time.time()
tab=[]
while len(file.readline())>0:
	tab.append(file.readline())
client.publish(MQTT_TOPIC,len(tab))
for i in range(len(tab)):
	client.publish(MQTT_TOPIC,tab[i])
fin = time.time()
print(fin-debut)
file.close()
