package main

import (
	"context"
	"encoding/json"
	"log"

	kafka "github.com/segmentio/kafka-go"
)

type EmailRequestedEventPayload struct {
	Email string `json:"email"`
	Link  string `json:"link"`
}

type EmailRequestedEvent struct {
	Id   string `json:"id"`
	Type string `json:"type"`
	Data EmailRequestedEventPayload
}

type subscriber struct {
	EmailClient *EmailClient
	Brokers     []string
	Partition   int
	Topic       string
	Offset      int64
}

type Subscriber interface {
	init() error
}

func NewSubscriber(offset int64, emailClient *EmailClient, brokers []string, topic string, partition int) Subscriber {
	return &subscriber{
		EmailClient: emailClient,
		Offset:      offset,
		Partition:   partition,
		Topic:       topic,
		Brokers:     brokers,
	}

}

func (s *subscriber) init() error {

	r := kafka.NewReader(kafka.ReaderConfig{
		Brokers:   s.Brokers,
		Topic:     s.Topic,
		Partition: s.Partition,
		MinBytes:  1e3,  // 10KB
		MaxBytes:  10e6, // 10MB
	})

	r.SetOffset(s.Offset)

	for {
		m, err := r.ReadMessage(context.Background())
		if err != nil {
			log.Printf("Err: %+v\n", err)
			break
		}

		log.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))

		var event EmailRequestedEvent
		err = json.Unmarshal(m.Value, &event)
		if err != nil {
			log.Printf("Err: %+v\n", err)
			return err
		}
		msg, err := NewEmail(s.EmailClient.from, event.Data.Email, event.Data.Link, "Showoff Reset Mail")
		if err != nil {
			log.Fatalf("Error creating mail: %v", err)
		}
		err = s.EmailClient.Send(msg)
		if err != nil {
			log.Fatalf("Error sending mail: %v", err)
		}
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
		return err
	}
	return nil
}
