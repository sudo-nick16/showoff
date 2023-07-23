package main

import "log"

func main() {
	config := SetupConfig()

	emailClient, err := NewEmailClient(
		config.SmtpConfig.User,
		config.SmtpConfig.Domain,
		config.SmtpConfig.Port,
		config.SmtpConfig.User,
		config.SmtpConfig.Password,
	)
	if err != nil {
		log.Printf("error: could not initialize email client - %v\n", err)
		panic(err)
	}
	subscriber := NewSubscriber(emailClient, config)
	subscriber.initialize()
}
