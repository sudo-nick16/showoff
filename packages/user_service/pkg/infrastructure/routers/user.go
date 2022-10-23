package routers

import (
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/interface/controller"

	"github.com/gorilla/mux"
)

const USERS_API_PREFIX string = "/api/users"

func MountUserRoutes(m *mux.Router, app *controller.AppController) {
	us := m.PathPrefix(USERS_API_PREFIX).Subrouter()
   
	us.HandleFunc("/{id:[0-9]+}",app.User.GetUserById).Methods("GET")
	// us.HandleFunc("/", app.User.GetAll).Methods("GET")
	us.HandleFunc("/", app.User.CreateUser).Methods("POST")
	us.HandleFunc("/", app.User.UpdateUser).Methods("PATCH")
	// us.HandleFunc("/", app.User.).Methods("DELETE")
}
