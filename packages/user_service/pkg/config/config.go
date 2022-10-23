package config

import (
	"log"
	"os"
	"reflect"
)

type Config struct {
	DBSource       string `mapstructure:"DB_SOURCE"`
	KafkaTopic     string `mapstructure:"KAFKA_TOPIC"`
	KafkaBrokers   string `mapstructure:"KAFKA_BROKERS"`
	ForwarderTopic string `mapstructure:"FORWARDER_TOPIC"`
	ServerPort     string `mapstructure:"SERVER_PORT"`
	Env            string `mapstructure:"ENV"`
}

var C Config

func LoadConfig() {
    C.Env = os.Getenv("ENV")
    log.Println("ENV: ", C.Env)
    if C.Env == "development" {
        C.DBSource = "postgres://root:passw@localhost:5431/showoff?sslmode=disable"
        C.KafkaBrokers = "localhost:9092"
        C.KafkaTopic = "users"
        C.ForwarderTopic = "user_events"
        C.ServerPort = ":4001"
    } else {
        C.DBSource = os.Getenv("DB_SOURCE")
        C.KafkaBrokers = os.Getenv("KAFKA_BROKERS")
        C.KafkaTopic = os.Getenv("KAFKA_TOPIC")
        C.ForwarderTopic = os.Getenv("FORWARDER_TOPIC")
        C.ServerPort = os.Getenv("SERVER_PORT")
    }

	// check if required env vars are set
	fields := reflect.TypeOf(C)
	values := reflect.ValueOf(C)
	num := fields.NumField()

	for i := 0; i < num; i++ {
		field := fields.Field(i)
		value := values.Field(i)
		if value.String() == "" {
			log.Fatalf("Missing environment variable: %v", field.Name)
		}
	}
}
