import paho.mqtt.client as mqtt
import json, sys
import time

arg = sys.argv[1]

MQTT_PORT = 2532
MQTT_TOPIC = "JSONtemplate"
MQTT_IP = "91.224.148.106"

file = open(arg,"r")
client = mqtt.Client("Kilian")
client.connect(MQTT_IP,MQTT_PORT)
tab=file.readlines()
print(tab)
client.publish(MQTT_TOPIC,len(tab))
for i in range(len(tab)):
	time.sleep(0.1)
	client.publish(MQTT_TOPIC,tab[i])
file.close()
