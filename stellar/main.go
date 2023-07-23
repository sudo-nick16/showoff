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
		log.Panicf("error: could not connect to mongodb - %v", err)
	}

	userRepo := repository.NewUserRepo(client, config)
	projectRepo := repository.NewProjectRepo(client, config)
	postRepo := repository.NewPostRepo(client, projectRepo, config)

	subscriber, err := NewSubscriber(userRepo, projectRepo, config)
	go subscriber.initialize()
	defer subscriber.Close()

	app := fiber.New(fiber.Config{
		// EnableTrustedProxyCheck: true,
		// TrustedProxies:          []string{"localhost:4200", "localhost"},
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
		AllowMethods:     "GET,POST,HEAD,PUT,DELETE,PATCH,OPTIONS",
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
		AllowCredentials: true,
	})

	app.Use(corsMiddleware)
	// app.Use(func(c *fiber.Ctx) error {
	// 	log.Println("request: ", c.OriginalURL(), " ", c.Method())
	// 	return c.Next()
	// })

	// app.Post("/projects", middlewares.AuthMiddleware(config), handlers.CreateProject(projectRepo))
	app.Post("/projects", middlewares.AuthMiddleware(config), handlers.CreateProject(projectRepo))

	// app.Get("/projects/u/:username", handlers.GetProjects(projectRepo))
	app.Get("/users/:username/projects", handlers.GetProjects(projectRepo))

	// app.Get("/projects/:username/:project_slug", handlers.GetProjectByUsernameAndProjectSlug(projectRepo, postRepo))
	app.Get("/users/:username/projects/:project_slug", handlers.GetProjectByUsernameAndProjectSlug(projectRepo, postRepo))

	// app.Get("/projects/:project_id", handlers.GetProject(projectRepo))
	app.Get("/projects/:project_id", handlers.GetProject(projectRepo))

	// app.Put("/projects", middlewares.AuthMiddleware(config), handlers.UpdateProject(projectRepo))
	app.Put("/projects/:project_id", middlewares.AuthMiddleware(config), handlers.UpdateProject(projectRepo))

	// app.Delete("/projects", middlewares.AuthMiddleware(config), handlers.DeleteProject(projectRepo))
	app.Delete("/projects/:project_id", middlewares.AuthMiddleware(config), handlers.DeleteProject(projectRepo))

	// app.Post("/posts", handlers.CreatePost(postRepo))
	app.Post("/projects/:project_id/posts", middlewares.AuthMiddleware(config), handlers.CreatePost(postRepo))

  // app.Get("/posts/:project_id", handlers.GetPostByProjectId(postRepo))
  app.Get("/projects/:project_id/posts", handlers.GetPostByProjectId(postRepo))

	// app.Put("/projects/:project_id/posts/:post_id", middlewares.AuthMiddleware(config), handlers.CreatePost(postRepo))
	app.Put("/projects/:project_id/posts/:post_id", middlewares.AuthMiddleware(config), handlers.CreatePost(postRepo))

	// app.Delete("/projects/:project_id/posts/:post_id", middlewares.AuthMiddleware(config), handlers.CreatePost(postRepo))
	app.Delete("/posts/:post_id", middlewares.AuthMiddleware(config), handlers.DeletePost(postRepo))

	app.Listen(":" + config.Port)
}
