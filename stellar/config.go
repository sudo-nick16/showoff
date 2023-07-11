package main

import (
	"log"

	dotenv "github.com/joho/godotenv"
	"github.com/sudo-nick16/env"
	"github.com/sudo-nick16/showoff/stellar/types"
)

func setupConfig() *types.Config {
	err := dotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file")
	}

	return &types.Config{
		MongoURI:  env.GetEnv("MONGO_URI", "mongodb://root:shorty1@127.0.0.1:27017/?serverSelectionTimeoutMS=2000"),
    DbName:    env.GetEnv("DB_NAME", "showoff"),
		ServerURI: env.GetEnv("SERVER_URI", "http://localhost:6070"),
		Port:      env.GetEnv("PORT", "6070"),
    Origin:   env.GetEnv("ORIGIN", "http://localhost:3000"),
    AccessPublicKey: env.GetEnvFromBase64("ACCESS_PUBLIC_KEY", ""),
	}
}
