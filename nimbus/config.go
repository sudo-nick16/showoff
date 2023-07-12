package main

import "github.com/sudo-nick16/env"

func setupConfig() *Config {
	return &Config{
		Port: env.GetEnv("PORT", "4200"),
		Servers: map[string]string{
      "users":    "http://localhost:6969",
      "auth":     "http://localhost:6969",
      "projects": "http://localhost:6968",
		},
	}
}
