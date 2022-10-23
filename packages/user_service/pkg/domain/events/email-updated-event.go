package events

type EmailUpdatedEventPayload struct {
    UserId string `json:"userId"`
    Email string `json:"email"`
}
