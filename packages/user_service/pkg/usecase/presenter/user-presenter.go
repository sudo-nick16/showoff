package presenter

import "github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"

type UserPresenter interface {
  ResponseUser(u *models.User) *models.User
}
