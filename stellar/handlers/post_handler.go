package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/gosimple/slug"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func GetPostByProjectId(postRepo *repository.PostRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project_id := c.Params("project_id")
		pid, err := primitive.ObjectIDFromHex(project_id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project id",
			})
		}
		posts, err := postRepo.GetAllByProjectId(pid)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Something went wrong",
			})
		}
		return c.JSON(fiber.Map{
			"posts": posts,
		})
	}
}

func CreatePost(postRepo *repository.PostRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project_id := c.Params("project_id")
		if project_id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project id",
			})
		}
		pid, err := primitive.ObjectIDFromHex(project_id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project id",
			})
		}
		post := types.Post{}
		post.ProjectId = pid
		post.Title = c.FormValue("title")
		post.Body = c.FormValue("body")
		post.Username = c.Locals("AuthContext").(*types.AuthTokenClaims).Username
		post.UserId = c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		post.Slug = slug.Make(post.Title)
		post.ProjectId = pid
		p, err := postRepo.Create(&post)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Something went wrong",
			})
		}
		return c.JSON(fiber.Map{
			"post": p,
		})
	}
}

func UpdatePost(postRepo *repository.PostRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		project_id := c.Params("project_id")
		post_id := c.Params("post_id")
		if project_id == "" || post_id == "" {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project id or post id",
			})
		}
		pid, err := primitive.ObjectIDFromHex(project_id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid project id",
			})
		}
		postid, err := primitive.ObjectIDFromHex(post_id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid post id",
			})
		}
		post := types.Post{}
		post.Id = postid
		post.ProjectId = pid
		post.Title = c.FormValue("title")
		post.Body = c.FormValue("body")
		post.Username = c.Locals("AuthContext").(*types.AuthTokenClaims).Username
		post.UserId = c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		post.Slug = slug.Make(post.Title)
		p, err := postRepo.Update(&post)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Something went wrong",
			})
		}
		return c.JSON(fiber.Map{
			"post": p,
		})
	}
}

func DeletePost(postRepo *repository.PostRepo) fiber.Handler {
	return func(c *fiber.Ctx) error {
		post_id := c.Params("post_id")
		pid, err := primitive.ObjectIDFromHex(post_id)
		if err != nil {
			return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
				"error": "Invalid post id",
			})
		}
		uid := c.Locals("AuthContext").(*types.AuthTokenClaims).UserId
		err = postRepo.Delete(pid, uid)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"error": "Something went wrong",
			})
		}
		return c.JSON(fiber.Map{
			"message": "Post deleted successfully",
		})
	}
}
