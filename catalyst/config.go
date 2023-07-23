package main

import (
	"log"

	"github.com/joho/godotenv"
	env "github.com/sudo-nick16/env"
)

type KafkaConfig struct {
	Topic   string   `json:"topic"`
	Brokers []string `json:"brokers"`
	GroupId string   `json:"groupId"`
}

type SmtpConfig struct {
	Domain   string `json:"domain"`
	Port     int    `json:"port"`
	User     string `json:"user"`
	Password string `json:"password"`
}

type Config struct {
	FromEmail   string
	KafkaConfig KafkaConfig
	SmtpConfig  SmtpConfig
}

func SetupConfig() *Config {
	err := godotenv.Load()
	if err != nil {
		log.Print("error: could not load .env file")
	}
	return &Config{
		KafkaConfig: KafkaConfig{
			Topic:   env.GetEnv("KAFKA_TOPIC", "outbox.event.user"),
			Brokers: env.GetEnvAsSlice("KAFKA_BROKERS", []string{""}, ","),
			GroupId: env.GetEnv("KAFKA_GROUP_ID", "catalyst"),
		},
		FromEmail: env.GetEnv("FROM_EMAIL", ""),
		SmtpConfig: SmtpConfig{
			Domain:   env.GetEnv("SMTP_DOMAIN", "smtp.gmail.com"),
			Port:     env.GetEnvAsInt("SMTP_PORT", 587),
			User:     env.GetEnv("SMTP_USER", ""),
			Password: env.GetEnv("SMTP_PASSWORD", ""),
		},
	}
}
