package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"github.com/sudo-nick16/showoff/stellar/types"
)

func CreateProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
    project := &types.Project{
      Title: c.FormValue("title"),
      Description: c.FormValue("description"),
      GithubURL: c.FormValue("github_url"),
      HostedURL: c.FormValue("url"),
      Tech: c.FormValue("tech"),
      Image: c.FormValue(),
    }
    projectRepo.Create()
		return nil
	}
}

func GetProject(projectRepo *repository.ProjectRepo) fiber.Handler {
    return func(c *fiber.Ctx) error {
        return nil
    }
}

func UpdateProject(projectRepo *repository.ProjectRepo) fiber.Handler {
    return func(c *fiber.Ctx) error {
        return nil
    }
}

func DeleteProject(projectRepo *repository.ProjectRepo) fiber.Handler {
    return func(c *fiber.Ctx) error {
        return nil
    }
}
