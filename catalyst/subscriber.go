package main

import (
	"context"
	"encoding/json"
	"log"

	kafka "github.com/segmentio/kafka-go"
)

type UserEventPayload struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Username string `json:"username"`
}

type Event struct {
	Id   string      `json:"id"`
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

type Subscriber struct {
	EmailClient *EmailClient
	Brokers     []string
	Partition   int
	Topic       string
	Offset      int64
}

func NewSubscriber(offset int64, emailClient *EmailClient, brokers []string, topic string, partition int) *Subscriber {
	return &Subscriber{
		EmailClient: emailClient,
		Offset:      offset,
		Partition:   partition,
		Topic:       topic,
		Brokers:     brokers,
	}
}

func (s *Subscriber) init() error {

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   s.Brokers,
		Topic:     s.Topic,
		Partition: s.Partition,
		MaxBytes:  10e6, // 10MB
	})

	r.SetOffset(s.Offset)

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Err: cannot read message %+v\n", err)
			break
		}

		log.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))

		event := Event{}
		err = json.Unmarshal(m.Value, &event)
		if err != nil {
			log.Printf("Err: cannot unmarshal event payload %+v\n", err)
			return err
		}
		eventType := event.Data.(map[string]interface{})["type"]
		switch eventType {
		case "user_created":
			email := event.Data.(map[string]interface{})["email"].(string)
			msg, err := NewEmail(s.EmailClient.from, email, "Go ahead and showcase your projects.", "Welcome to showoff!")
			if err != nil {
				log.Fatalf("Error creating mail: %v", err)
			}
			err = s.EmailClient.Send(msg)
			if err != nil {
				log.Fatalf("Error sending mail: %v", err)
			}
		default:
			log.Printf("Unknown event type: %s", eventType)
		}
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
		return err
	}
	return nil
}
