package main

import (
	"context"
	"encoding/json"
	"errors"
	"log"

	kafka "github.com/segmentio/kafka-go"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"github.com/sudo-nick16/showoff/stellar/types"
)

type EventHeader struct {
	Id interface{} `json:"id"`
}

type UserPayload struct {
	Id       int    `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
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
	userRepo *repository.UserRepo
	projectRepo *repository.ProjectRepo
	reader   *kafka.Reader
}

func NewSubscriber(userRepo *repository.UserRepo, projectRepo *repository.ProjectRepo, config *types.Config) (*Subscriber, error) {
	reader := kafka.NewReader(kafka.ReaderConfig{
		Brokers:  config.KafkaConfig.Brokers,
		Topic:    config.KafkaConfig.Topic,
		GroupID:  config.KafkaConfig.GroupId,
		MinBytes: 1e3,  // 10KB
		MaxBytes: 10e6, // 10MB
	})
	if reader == nil {
		return nil, errors.New("cannot create kafka reader")
	}
	return &Subscriber{
		userRepo: userRepo,
		reader:   reader,
    projectRepo: projectRepo,
	}, nil
}

func unmarshalUser(str string) (*types.User, error) {
	payload := UserPayload{}

	err := json.Unmarshal([]byte(str), &payload)
	if err != nil {
		log.Fatalf("error: could not unmarshal user from message payload - %v\n", err)
	}

	usr := &types.User{
		UserId:   payload.Id,
		Username: payload.Username,
		Name:     payload.Name,
		Email:    payload.Email,
	}
	return usr, nil
}

func (s *Subscriber) initialize() {
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
					log.Printf("error: could not unmarshal user from message payload - %v\n", err)
				} else {
					_, err = s.userRepo.Create(usr)
					if err != nil {
						log.Printf("error: could not create user - %v\n", err)
					}
				}
				if err = s.reader.CommitMessages(context.Background(), message); err != nil {
					log.Fatalf("error: could not commit message - %v\n", err)
				}
			}
		case "user_updated":
			{
				usr, err := unmarshalUser(messageValue.Payload.Payload)
				if err != nil {
					log.Printf("error: could not unmarshal user from message payload - %v\n", err)
				} else {
					_, err = s.userRepo.Update(usr)
					if err != nil {
						log.Printf("error: could not update user - %v\n", err)
					}
				}
				if err = s.reader.CommitMessages(context.Background(), message); err != nil {
					log.Fatalf("error: could not commit message - %v\n", err)
				}
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
