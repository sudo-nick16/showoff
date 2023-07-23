package handlers

import (
	"encoding/json"

	"github.com/gofiber/fiber/v2"
	"github.com/gosimple/slug"
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
		project.Slug = slug.Make(project.Title)
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

func GetProjectByUsernameAndProjectSlug(projectRepo *repository.ProjectRepo, postRepo *repository.PostRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		p_slug := c.Params("project_slug")
		username := c.Params("username")
		if p_slug == "" || username == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		project, err := projectRepo.GetByUsernameAndProjectSlug(username, p_slug)
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
		username := c.Params("username")
		if username == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		projects, err := projectRepo.GetAllByUsername(username)
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
		project.Slug = slug.Make(project.Title)
		project.Tagline = c.FormValue("tagline")
		project.Description = c.FormValue("description")
		project.Image = c.FormValue("img")
		project.GithubURL = c.FormValue("github_url")
		project.HostedURL = c.FormValue("hosted_url")
		project.Username = c.Locals("AuthContext").(*types.AuthTokenClaims).Username
		project.UserId = c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		if project.Title == "" || project.Username == "" {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		pid, err := primitive.ObjectIDFromHex(c.FormValue("_id"))
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid data")
		}
		project.Id = pid
		tech := []string{}
		err = json.Unmarshal([]byte(c.FormValue("tech")), &tech)
		if err != nil {
			return err
		}
		project.Tech = tech
		err = projectRepo.Update(project)
		if err != nil {
			return err
		}
		return c.JSON(fiber.Map{
			"project": project,
		})
	}
}

func DeleteProject(projectRepo *repository.ProjectRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project_id := c.Params("project_id")
		user_id := c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		if project_id == "" {
			return fiber.NewError(fiber.StatusBadRequest, "project id is required")
		}
		pid, err := primitive.ObjectIDFromHex(project_id)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "invalid project id")
		}
		err = projectRepo.Delete(pid, user_id)
		if err != nil {
			return fiber.NewError(fiber.StatusBadRequest, "could not delete the project.")
		}
		return c.JSON(fiber.Map{
			"message": "project deleted successfully",
		})
	}
}
