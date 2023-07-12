package main

import (
	"log"

	mail "github.com/wneessen/go-mail"
)

type EmailClient struct {
	client *mail.Client
	from   string
}

func NewEmailClient(from string, smtpServerDomain string, smtpPort int, smtpUser string, smtpPassword string) (*EmailClient, error) {
	client, err := mail.NewClient(smtpServerDomain, mail.WithPort(smtpPort), mail.WithSMTPAuth(mail.SMTPAuthPlain), mail.WithUsername(smtpUser), mail.WithPassword(smtpPassword))
	if err != nil {
		log.Fatalf("Error creating mail client: %v", err)
		return nil, err
	}
	return &EmailClient{
		client: client,
		from:   from,
	}, nil
}

func NewEmail(from, to, body, subject string) (*mail.Msg, error) {
	msg := mail.NewMsg()
	if err := msg.From(from); err != nil {
		return nil, err
	}
	if err := msg.To(to); err != nil {
		return nil, err
	}
	msg.Subject(subject)
	msg.SetBodyString(mail.TypeTextPlain, body)
	return msg, nil
}

func (ec *EmailClient) Send(e *mail.Msg) error {
	if err := ec.client.DialAndSend(e); err != nil {
		log.Printf("Error sending mail: %v", err)
		return err
	}
	return nil
}
