package main

import (
	"log"

	"github.com/joho/godotenv"
	env "github.com/sudo-nick16/env"
)

type KafkaConfig struct {
	Topic     string   `json:"topic"`
	Brokers   []string `json:"brokers"`
	Partition int      `json:"partition"`
	FromEmail string   `json:"fromEmail"`
}

type SmtpConfig struct {
	Domain   string `json:"domain"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type Config struct {
	KafkaConfig KafkaConfig
	SmtpConfig  SmtpConfig
}

func SetupConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Print("No .env found.")
	}
	return &Config{
		KafkaConfig: KafkaConfig{
			Topic:     env.GetEnv("KAFKA_TOPIC", "emails"),
			Brokers:   env.GetEnvAsSlice("KAFKA_TOPIC", []string{"showoff-kafka:9092", "kafka:9093"}, ","),
			Partition: env.GetEnvAsInt("KAFKA_PARTITION", 0),
			FromEmail: env.GetEnv("FROM_EMAIL", "showoff@gmail.com"),
		},
		SmtpConfig: SmtpConfig{
			Domain:   env.GetEnv("SMTP_DOMAIN", "smtp.gmail.com"),
			Port:     env.GetEnvAsInt("SMTP_PORT", 587),
			User:     env.GetEnv("SMTP_USER", ""),
			Password: env.GetEnv("SMTP_PASSWORD", ""),
		},
	}
}
