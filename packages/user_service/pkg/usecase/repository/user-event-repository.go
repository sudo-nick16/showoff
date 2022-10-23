package repository

import "github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/events"

type UserEventRepository interface {
    FireCreatedEvent(payload *events.UserCreatedEventPayload) error
    FireUsernameUpdatedEvent(payload *events.UsernameUpdatedEventPayload) error 
    FireEmailUpdatedEvent(payload *events.EmailUpdatedEventPayload) error 
}
