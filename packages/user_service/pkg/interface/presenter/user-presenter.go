package presenter

import (
	"log"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"
)

type userPresenter struct{}

type UserPresenter interface {
  ResponseUser(*models.User) *models.User
}

func NewUserPresenter() UserPresenter {
  return &userPresenter{}
}

func (up *userPresenter) ResponseUser(u *models.User) *models.User {
  log.Println("ResponseUser")
  return u
}

