package main

import "log"

func main() {
	c := SetupConfig()

	econn, err := NewEmailClient(c.SmtpConfig.User, c.SmtpConfig.Domain, c.SmtpConfig.Port, c.SmtpConfig.User, c.SmtpConfig.Password)
	if err != nil {
        log.Println("Error creating email client")
		panic(err)
	}
	dbConn, err := NewConn()
	if err != nil {
		panic(err)
	}
	repo := NewRepo(dbConn)
	offset, err := repo.GetOffset()
	if err != nil {
		panic(err)
	}
	subscriber := NewSubscriber(offset, econn, c.KafkaConfig.Brokers, c.KafkaConfig.Topic, c.KafkaConfig.Partition)
	err = subscriber.init()
	if err != nil {
		panic(err)
	}
}

