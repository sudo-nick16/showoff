package interactor

import (
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/presenter"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/repository"
)

type userInteractor struct {
	UserRepository      repository.UserRepository
	UserPresenter       presenter.UserPresenter
}

type UserInteractor interface {
	GetById(id uint) (*models.User, error)
	Create(u *models.User) (*models.User, error)
	Update(u *models.User, id uint) (*models.User, error)
}

func NewUserInteractor(ur repository.UserRepository, up presenter.UserPresenter) UserInteractor {
	return &userInteractor{
		UserRepository:      ur,
		UserPresenter:       up,
	}
}

func (ui *userInteractor) GetById(id uint) (*models.User, error) {
	user, err := ui.UserRepository.GetById(id)
	if err != nil {
		return nil, err
	}
	return ui.UserPresenter.ResponseUser(user), nil
}

func (ui *userInteractor) Create(u *models.User) (*models.User, error) {
	user, err := ui.UserRepository.Create(u)
	if err != nil {
		return nil, err
	}
	return ui.UserPresenter.ResponseUser(user), nil
}

func (ui *userInteractor) Update(u *models.User, id uint) (*models.User, error) {
	user, err := ui.UserRepository.Update(u, id)
	if err != nil {
		return nil, err
	}
	return ui.UserPresenter.ResponseUser(user), nil
}

