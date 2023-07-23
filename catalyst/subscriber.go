package main

import (
	"context"
	"encoding/json"
	"log"

	kafka "github.com/segmentio/kafka-go"
)

type EventHeader struct {
	Id interface{} `json:"id"`
}

type UserPayload struct {
	Id       int    `json:"id"`
	Name     string `json:"name"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

type EventPayload struct {
	Payload string `json:"payload"`
	Type    string `json:"type"`
}

type Message struct {
	Payload EventPayload `json:"payload"`
}

type Subscriber struct {
	EmailClient *EmailClient
	reader      *kafka.Reader
}

func NewSubscriber(emailClient *EmailClient, config *Config) *Subscriber {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  config.KafkaConfig.Brokers,
		Topic:    config.KafkaConfig.Topic,
		GroupID:  config.KafkaConfig.GroupId,
		MaxBytes: 10e6,
	})
	return &Subscriber{
		EmailClient: emailClient,
		reader:      reader,
	}
}

func unmarshalUser(str string) (*UserPayload, error) {
	payload := UserPayload{}
	err := json.Unmarshal([]byte(str), &payload)
	if err != nil {
		log.Printf("error: could not unmarshal user from message payload - %v\n", err)
	}
	return &payload, nil
}

func (s *Subscriber) initialize() {
	defer s.reader.Close()
	for {
		message, err := s.reader.FetchMessage(context.Background())
		if err != nil {
			log.Fatalf("error: could not read message from kafka - %v\n", err)
		}

		log.Printf("message at offset %d: %s = %s\n", message.Offset, string(message.Key), string(message.Value))

		messageValue := Message{}
		err = json.Unmarshal(message.Value, &messageValue)
		if err != nil {
			log.Printf("error: could not unmarshal the kafka message - %v\n", err)
		}

		switch messageValue.Payload.Type {
		case "user_created":
			{
				usr, err := unmarshalUser(messageValue.Payload.Payload)
				if err != nil {
					log.Printf("error: could not create user - %v\n", err)
				} 
                if usr != nil && usr.Email != "" {
					msg, err := NewEmail(s.EmailClient.from, usr.Email, "Go ahead and showcase your projects.", "Welcome to showoff!")
					if err != nil {
						log.Printf("error: could not create email message - %v", err)
					}
					err = s.EmailClient.Send(msg)
					if err != nil {
						log.Printf("error: could not send the email message - %v", err)
					}
				}
				s.reader.CommitMessages(context.Background(), message)
			}
		default:
			{
				log.Printf("error: unexpected event type (%v) - %v\n", messageValue.Payload.Type, err)
			}
		}
	}

}

func (s *Subscriber) Close() error {
	if err := s.reader.Close(); err != nil {
		log.Fatal("error: failed to close the kafka reader - ", err)
		return err
	}
	return nil
}
