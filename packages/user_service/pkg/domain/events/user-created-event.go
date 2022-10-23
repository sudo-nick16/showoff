package events

type UserCreatedEventPayload struct {
    UserId uint `json:"userId"`
    Username string `json:"username"`
}


