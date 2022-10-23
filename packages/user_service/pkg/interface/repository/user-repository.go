package repository

import (
	"encoding/json"
	"log"

	"github.com/ThreeDotsLabs/watermill"
	"github.com/ThreeDotsLabs/watermill-sql/pkg/sql"
	"github.com/ThreeDotsLabs/watermill/components/forwarder"
	"github.com/ThreeDotsLabs/watermill/message"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/config"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/events"

	"github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"
	r "github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/repository"
	"github.com/sudo-nick16/showoff/packages/user_service/types"
	// "gorm.io/gorm"
)

type userRepository struct {
	db types.DB
    logger watermill.LoggerAdapter
}

func NewUserRepository(db types.DB) r.UserRepository {
    logger := watermill.NewStdLogger(false, false)
	return &userRepository{
		db: db,
        logger: logger,
	}
}

func (ur *userRepository) GetById(id uint) (*models.User, error) {
	user := &models.User{}
	row := ur.db.QueryRow("select id, name, username from users where id = $1", id).Scan(&user.ID, &user.Name, &user.Username)
    log.Printf("Get request res (%v): %v\n", id, row)
	return user, nil
}

func (ur *userRepository) Create(u *models.User) (*models.User, error) {
	tx, err := ur.db.Begin()
	if err != nil {
		return nil, err
	}
	defer func() {
		if err == nil {
			tx.Commit()
		} else {
            ur.logger.Info("Rolling back transaction", watermill.LogFields{"err": err.Error()})
			tx.Rollback()
		}
	}()
	res, err := tx.Exec("insert into users (name, email, username, password) values ($1, $2, $3, $4) returning id", u.Name, u.Email, u.Username, u.Password)
    log.Println(res)
    if err != nil {
        return nil, err
    }
	var publisher message.Publisher 
	publisher, err = sql.NewPublisher(
		tx,
		sql.PublisherConfig{
			SchemaAdapter: sql.DefaultPostgreSQLSchema{},
		},
		ur.logger,
	)
    if err != nil {
        return nil, err
    }
    publisher = forwarder.NewPublisher(publisher, forwarder.PublisherConfig{
        ForwarderTopic: config.C.ForwarderTopic,
    })
    event := events.UserCreatedEventPayload{
        UserId: u.ID,
        Username: u.Username,
    }
    payload, err := json.Marshal(event)
    log.Printf("Event payload: %v\n", string(payload))
    if err != nil {
        return nil, err
    }
    err = publisher.Publish(config.C.KafkaTopic, message.NewMessage(watermill.NewULID(), payload))
    log.Println("Error publishing message: ", err)
    if err != nil {
        return nil, err
    }
	return u, err
}

func (ur *userRepository) Update(u *models.User, id uint) (*models.User, error) {
	return u, nil
}
