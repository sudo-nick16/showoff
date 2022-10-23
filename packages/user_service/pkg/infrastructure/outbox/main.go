package outbox

import (
	"context"
	"log"

	"github.com/ThreeDotsLabs/watermill"
	"github.com/ThreeDotsLabs/watermill-kafka/v2/pkg/kafka"
	"github.com/ThreeDotsLabs/watermill-sql/pkg/sql"
	"github.com/ThreeDotsLabs/watermill/components/forwarder"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/config"
	"github.com/sudo-nick16/showoff/packages/user_service/types"
)

func InitOutboxComponent(db types.DB, logger watermill.LoggerAdapter) {
	// Setup the Forwarder component so it takes messages from MySQL subscription and pushes them to Google Pub/Sub.
	sqlSubscriber, err := sql.NewSubscriber(
		db,
		sql.SubscriberConfig{
			SchemaAdapter:    sql.DefaultPostgreSQLSchema{},
			OffsetsAdapter:   sql.DefaultPostgreSQLOffsetsAdapter{},
			InitializeSchema: true,
		},
		logger,
	)
	expectNoErr(err)

	kafkaPublisher, err := kafka.NewPublisher(
		kafka.PublisherConfig{
            Brokers: []string{config.C.KafkaBrokers},
            Marshaler: kafka.DefaultMarshaler{},
		},
		logger,
	)
	expectNoErr(err)

	fwd, err := forwarder.NewForwarder(sqlSubscriber, kafkaPublisher, logger, forwarder.Config{
		ForwarderTopic: config.C.ForwarderTopic,
	})
	expectNoErr(err)

	go func() {
		err := fwd.Run(context.Background())
		expectNoErr(err)
	}()

}

func expectNoErr(err error) {
	if err != nil {
		log.Fatalf("expected no error, got: %s", err)
	}
}
