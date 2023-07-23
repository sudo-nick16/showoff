package main

import "github.com/sudo-nick16/env"

func setupConfig() *Config {
	return &Config{
		Port: env.GetEnv("PORT", "4200"),
		Servers: map[string]string{
			"apex":    "http://localhost:6969",
			"stellar": "http://localhost:6968",
		},
	}
}
