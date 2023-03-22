# Argumentos para la incialización:
        p: "puerto",
        a: "ambiente",
        m: "mode"
# Por default:    
        puerto: "8080",
        ambiente: "local",
        mode: "fork", 



#####
#####

# DATOS DEL ENV
        DB_SELECT=0 #0 Mongo - #1 Firebase
        FIREBASE_API_KEY=
        MONGO_DB_LOCAL=
        MONGO_DB_URL=
        SESSION_SECRET=
        MAIL_ADMIN=
        GMAIL_TPWD=
                
        # WZP TWILIO
        ACCOUNTSID = 
        AUTH_TOKEN = 
        TWILIO_PHONE_NUMBER = 


#### Logs
        El resultado de Artillery en modo FORK y CLUSTER se encuentra dentro de la carpeta LOGS
        El log de errores críticos esta dentro de la carpeta LOGS