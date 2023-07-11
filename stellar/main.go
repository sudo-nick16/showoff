package main

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/sudo-nick16/showoff/stellar/handlers"
	"github.com/sudo-nick16/showoff/stellar/middlewares"
	"github.com/sudo-nick16/showoff/stellar/repository"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func main() {
	config := setupConfig()

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MongoURI))
	if err != nil {
		log.Panic("Couldn't connect to mongodb.")
	}

	app := fiber.New(fiber.Config{
		ErrorHandler: func(ctx *fiber.Ctx, err error) error {
			code := fiber.StatusInternalServerError
			var e *fiber.Error
			if errors.As(err, &e) {
				code = e.Code
			}
			err = ctx.Status(code).JSON(fiber.Map{
				"error": err.Error(),
			})
			return nil
		},
	})

	corsMiddleware := cors.New(cors.Config{
		AllowOrigins:     config.Origin,
		AllowCredentials: true,
	})

	app.Use(corsMiddleware)

	projectRepo := repository.NewProjectRepo(client, config)

	app.Get("/projects/:project_id", handlers.GetProject(projectRepo))

	app.Delete("/projects", middlewares.AuthMiddleware(config), handlers.GetProject(projectRepo))

	app.Put("/projects", middlewares.AuthMiddleware(config), handlers.GetProject(projectRepo))

	app.Post("/projects", middlewares.AuthMiddleware(config), handlers.CreateProject(projectRepo))

	app.Listen(":" + config.Port)
}
