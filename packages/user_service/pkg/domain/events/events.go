package events

import "github.com/google/uuid"

type Event struct {
    ID string `json:"id"`
    Type string `json:"type"`
    Data interface{} `json:"data"`
}

func MakeUserCreatedEvent(up UserCreatedEventPayload) Event{
    eventType := "UserCreated"
    return Event{
        ID: uuid.New().String(),
        Type: eventType,
        Data: up,
    }
}


func MakeUsernameUpdatedEvent(up UsernameUpdatedEventPayload) Event{
    eventType := "UserUpdated"
    return Event{
        ID: uuid.New().String(),
        Type: eventType,
        Data: up,
    }
}


func MakeEmailUpdatedEvent(up EmailUpdatedEventPayload) Event{
    eventType := "UserUpdated"
    return Event{
        ID: uuid.New().String(),
        Type: eventType,
        Data: up,
    }
}
