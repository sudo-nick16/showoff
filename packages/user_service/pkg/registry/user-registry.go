package registry

import (
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/interface/controller"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/interactor"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/presenter"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/repository"
  ir "github.com/sudo-nick16/showoff/packages/user_service/pkg/interface/repository"
  ip "github.com/sudo-nick16/showoff/packages/user_service/pkg/interface/presenter" 
)

func (r *registry) NewUserController() controller.UserController {
  return controller.NewUserController(r.NewUserInteractor())
}

func (r *registry) NewUserInteractor() interactor.UserInteractor {
  return interactor.NewUserInteractor(r.NewUserRepository(), r.NewUserPresenter())
}

func (r *registry) NewUserRepository() repository.UserRepository {
  return ir.NewUserRepository(r.db)
}

func (r *registry) NewUserPresenter() presenter.UserPresenter {
  return ip.NewUserPresenter()
}
