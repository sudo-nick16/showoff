package main

import (
	"context"
	"encoding/json"
	"log"

	kafka "github.com/segmentio/kafka-go"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type UserEventPayload struct {
	UserId   string `json:"id"`
	Username string `json:"username"`
}

type UserEvent struct {
	Id   string           `json:"id"`
	Type string           `json:"type"`
	Data UserEventPayload `json:"data"`
}

type subscriber struct {
	UserRepo  *repository.UserRepo
	Brokers   []string
	Partition int
	Topic     string
	Offset    int64
}

type Subscriber interface {
	init() error
}

func NewSubscriber(offset int64, userRepo *repository.UserRepo, brokers []string, topic string, partition int) Subscriber {
	return &subscriber{
		UserRepo:  userRepo,
		Offset:    offset,
		Partition: partition,
		Topic:     topic,
		Brokers:   brokers,
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

		var event UserEvent
		err = json.Unmarshal(m.Value, &event)
		if err != nil {
			log.Printf("Err: %+v\n", err)
			return err
		}
		id, err := primitive.ObjectIDFromHex(event.Data.UserId)
		if err != nil {
			log.Printf("Err: %+v\n", err)
			return err
		}
		usr := &types.User{
			ID:       id,
			Username: event.Data.Username,
		}
		if event.Type == "user_created" {
			_, err = s.UserRepo.Create(usr)
			if err != nil {
				log.Fatalf("Error creating mail: %v", err)
			}
		} else if event.Type == "user_updated" {
			_, err = s.UserRepo.Create(usr)
			if err != nil {
				log.Fatalf("Error creating mail: %v", err)
			}
		}
	}

	if err := r.Close(); err != nil {
		log.Fatal("failed to close reader:", err)
		return err
	}
	return nil
}
