package worker

import (
	"context"
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/gradeloop/email-service/internal/domain"
	infra "github.com/gradeloop/email-service/internal/infrastructure"
	"github.com/gradeloop/email-service/internal/infrastructure/rabbitmq"
	amqp "github.com/rabbitmq/amqp091-go"
)

type Consumer struct {
	consumer *rabbitmq.Consumer
	repo     domain.EmailRepository
	mailer   *infra.Mailer
	producer *rabbitmq.Producer // For retry/dead-letter
}

func NewConsumer(consumer *rabbitmq.Consumer, repo domain.EmailRepository, mailer *infra.Mailer, producer *rabbitmq.Producer) *Consumer {
	return &Consumer{
		consumer: consumer,
		repo:     repo,
		mailer:   mailer,
		producer: producer,
	}
}

func (c *Consumer) Start(ctx context.Context) {
	log.Println("Starting RabbitMQ Consumer...")
	msgs, err := c.consumer.Consume("email_send") // Queue name
	if err != nil {
		log.Fatalf("Failed to start consumer: %v", err)
	}

	forever := make(chan bool)

	go func() {
		for d := range msgs {
			log.Printf("Received a message: %s", d.Body)
			if err := c.processMessage(ctx, d); err != nil {
				log.Printf("Error processing message: %v", err)
				d.Nack(false, true) // Requeue
			} else {
				d.Ack(false)
			}
		}
	}()

	log.Printf(" [*] Waiting for messages. To exit press CTRL+C")
	<-forever
}

func (c *Consumer) processMessage(ctx context.Context, m amqp.Delivery) error {
	var event struct {
		MessageID  uuid.UUID `json:"message_id"`
		Recipients []string  `json:"recipients"`
		Subject    string    `json:"subject"`
		// ... other fields
	}

	if err := json.Unmarshal(m.Body, &event); err != nil {
		return err
	}

	// 1. Send Email (Mocked or Real)
	// We need to fetch body if it was template-based, or it's in payload.
	// For now assuming payload has enough info or we fetch from DB.
	// Let's fetch the message from DB to get status ensuring duplicate processing check?
	_, err := c.repo.GetMessage(ctx, event.MessageID)
	if err != nil {
		return err
	}

	// Send
	// c.mailer.Send(event.Recipients, event.Subject, "<h1>Hello</h1>", "Hello")

	// Update Status
	c.repo.UpdateMessageStatus(ctx, event.MessageID, domain.StatusSent)

	return nil
}
