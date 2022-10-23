package events

type UsernameUpdatedEventPayload struct {
    UserId string `json:"userId"`
    Username string `json:"username"`
}

