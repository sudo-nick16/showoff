package main

import (
	"context"
	"errors"
	"fmt"
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
	fmt.Println(config)

	ctx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(config.MongoURI))
	if err != nil {
		log.Panic("Couldn't connect to mongodb.")
	}

	app := fiber.New(fiber.Config{
		EnableTrustedProxyCheck: true,
		TrustedProxies:          []string{"localhost:4200", "localhost"},
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

	fmt.Println(config.Origin)

	corsMiddleware := cors.New(cors.Config{
		AllowOrigins:     config.Origin,
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	})

	app.Use(corsMiddleware)
	app.Use(func(c *fiber.Ctx) error {
		fmt.Println("request: ", c.OriginalURL(), " ", c.Method())
		return c.Next()
	})

	projectRepo := repository.NewProjectRepo(client, config)

	app.Get("/projects/:project_id", handlers.GetProject(projectRepo))

	app.Get("/projects/u/:user_id", handlers.GetProjects(projectRepo))

	app.Delete("/projects", middlewares.AuthMiddleware(config), handlers.DeleteProject(projectRepo))

	app.Put("/projects", middlewares.AuthMiddleware(config), handlers.UpdateProject(projectRepo))

	app.Post("/projects", middlewares.AuthMiddleware(config), handlers.CreateProject(projectRepo))

	app.Listen(":" + config.Port)
}
