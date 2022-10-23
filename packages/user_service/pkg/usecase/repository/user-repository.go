package repository

import "github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"

type UserRepository interface {
	GetById(id uint) (*models.User, error)
	Create(p *models.User) (*models.User, error)
	Update(u *models.User, id uint) (*models.User, error)
}
