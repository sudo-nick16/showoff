package registry

import (
	"github.com/ThreeDotsLabs/watermill"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/interface/controller"
	"github.com/sudo-nick16/showoff/packages/user_service/types"
)

type registry struct {
	db              types.DB
	watermillLogger watermill.LoggerAdapter
}

type Registry interface {
	NewAppController() controller.AppController
}

func NewRegistry(db types.DB, logger watermill.LoggerAdapter) Registry {
	return &registry{db, logger}
}

func (r *registry) NewAppController() controller.AppController {
	return controller.AppController{
		User: r.NewUserController(),
	}
}
