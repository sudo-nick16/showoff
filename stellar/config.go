package main

import (
	"log"

	"github.com/golang-jwt/jwt/v5"
	dotenv "github.com/joho/godotenv"
	"github.com/sudo-nick16/env"
	"github.com/sudo-nick16/showoff/stellar/types"
)

func setupConfig() *types.Config {
	err := dotenv.Load(".env")
	if err != nil {
		log.Println("Error loading .env file")
	}

	accessPublicKey, err := jwt.ParseRSAPublicKeyFromPEM([]byte(env.GetEnvFromBase64("ACCESS_PUBLIC_KEY", "")))
	if err != nil {
		log.Println("Error parsing access public key")
	}

	return &types.Config{
		MongoURI:        env.GetEnv("MONGO_URI", "mongodb://root:shorty1@127.0.0.1:27017/?serverSelectionTimeoutMS=2000"),
		DbName:          env.GetEnv("DB_NAME", "showoff"),
		ServerURI:       env.GetEnv("SERVER_URI", "http://localhost:6968"),
		Port:            env.GetEnv("PORT", "6970"),
		Origin:          env.GetEnv("ORIGIN", "http://localhost:3000, http://localhost:4200"),
		AccessPublicKey: accessPublicKey,
	}
}
