import paho.mqtt.client as mqtt
import time

file = open("horse.js","r")
msg = file.readlines()
msg2 ="".join(msg)
print(msg2)
PORT = 2532
client = mqtt.Client("samconnect")
client.connect("91.224.148.106",PORT)
i = 0
client.publish("testMQTT","Envoie du fichier")
time.sleep(0.01)

client.publish("testMQTT","Contenue : "+msg2)

