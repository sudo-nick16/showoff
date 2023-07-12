package handlers

import (
	"encoding/json"
	"fmt"
	"strconv"

	"github.com/gofiber/fiber/v2"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project := &types.Project{}
		project.Title = c.FormValue("title")
		project.Description = c.FormValue("description")
		project.Image = c.FormValue("img")
		project.GithubURL = c.FormValue("github_url")
		project.HostedURL = c.FormValue("hosted_url")
		project.Tagline = c.FormValue("tagline")
		project.Username = c.Locals("AuthContext").(*types.AuthTokenClaims).Username
		project.UserId = c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		if project.Title == "" || project.Description == "" || project.Image == "" || project.GithubURL == "" || project.HostedURL == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		tech := []string{}
		err := json.Unmarshal([]byte(c.FormValue("tech")), &tech)
		if err != nil {
			return err
		}
		project.Tech = tech
		p, err := projectRepo.Create(project)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"project": p,
		})
	}
}

func GetProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		pids := c.Params("project_id")
		if pids == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		pid, err := primitive.ObjectIDFromHex(pids)
		if err != nil {
			return err
		}
		project, err := projectRepo.Get(pid)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"project": project,
		})
	}
}

func GetProjects(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		uids := c.Params("user_id")
		if uids == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		uid, err := strconv.Atoi(uids)
		if err != nil {
			return err
		}
		projects, err := projectRepo.GetAllByUserId(uid)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"projects": projects,
		})
	}
}

func UpdateProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project := &types.Project{}
		project.Title = c.FormValue("title")
		project.Description = c.FormValue("description")
		project.Image = c.FormValue("img")
		project.GithubURL = c.FormValue("github_url")
		project.HostedURL = c.FormValue("hosted_url")
		project.Username = c.Locals("AuthContext").(*types.AuthTokenClaims).Username
		project.UserId = c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		if project.Title == "" || project.Username == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		tech := []string{}
		err := json.Unmarshal([]byte(c.FormValue("tech")), &tech)
		if err != nil {
			return err
		}
		project.Tech = tech
		p, err := projectRepo.Create(project)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"project": p,
		})
	}
}

func DeleteProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		fmt.Println("delete project")
		return nil
	}
}
