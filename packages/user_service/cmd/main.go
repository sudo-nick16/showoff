package main

import (
	"context"
	"log"
	"net/http"
	"os"
	"os/signal"
	"time"

	"github.com/ThreeDotsLabs/watermill"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/config"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/infrastructure/datastore"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/infrastructure/outbox"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/infrastructure/routers"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/registry"

	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

func main() {
	config.LoadConfig()

	db, err := datastore.NewDB()
	if err != nil {
        log.Fatalf("Error in DB config: %v", err)
	}

    // Init outbox component
    watermillLogger := watermill.NewStdLogger(false, false)
    outbox.InitOutboxComponent(db, watermillLogger)

	reg := registry.NewRegistry(db, watermillLogger)
	app := reg.NewAppController()

	r := mux.NewRouter()
	h := cors.AllowAll().Handler(r)

	routers.MountUserRoutes(r, &app)
	// routers.MountProjectRoutes(r, &app)

	s := &http.Server{
		Addr:         config.C.ServerPort,
		Handler:      h,
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
		IdleTimeout:  120 * time.Second,
	}

	log.Printf("Server is starting on port 4001\n")
	s.ListenAndServe()

	go func() {
		err := s.ListenAndServe()
		if err != nil {
			log.Fatalf("Server starting error: %v", err.Error())
			os.Exit(1)
		}
	}()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt)
	signal.Notify(c, os.Kill)

	sig := <-c
	log.Fatalf("Got signal: %v", sig)

	ctx, err1 := context.WithTimeout(context.Background(), 1*time.Second)
	if err1 != nil {
		log.Fatalf("%+v", err1)
	}
	s.Shutdown(ctx)
}
