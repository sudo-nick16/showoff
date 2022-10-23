package controller

import (
	"encoding/json"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/domain/models"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/usecase/interactor"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

type userController struct {
	userInteractor interactor.UserInteractor
}

type UserController interface {
	GetUserById(w http.ResponseWriter, r *http.Request)
	CreateUser(w http.ResponseWriter, r *http.Request)
	UpdateUser(w http.ResponseWriter, r *http.Request)
}

func NewUserController(ui interactor.UserInteractor) UserController {
	return &userController{
		userInteractor: ui,
	}
}

func (uc *userController) GetUserById(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	sid := vars["id"]
	id, err := strconv.ParseUint(sid, 10, 64)
	user, err := uc.userInteractor.GetById(uint(id))
	if err != nil {
		log.Printf("Error getting user: %v", err)
	}
	json.NewEncoder(w).Encode(user)

}

func (uc *userController) CreateUser(w http.ResponseWriter, r *http.Request) {
	u := &struct {
		Username string `json:"username"`
		Password string `json:"password"`
		Name     string `json:"name"`
		Email    string `json:"email"`
	}{}
	err := json.NewDecoder(r.Body).Decode(&u)
	// log.Printf("User Decoded: %+v",*u)
	if err != nil {
		e := &struct {
			Error string `json:"error"`
		}{err.Error()}
		json.NewEncoder(w).Encode(e)
	}
	newUser := &models.User{
		Username: u.Username,
		Password: u.Password,
		Name:     u.Name,
		Email:    u.Email,
	}
	user, err := uc.userInteractor.Create(newUser)
	if err != nil {
		log.Printf("Error creating user: %v", err)
	}
	json.NewEncoder(w).Encode(user)
	return
}

func (uc *userController) UpdateUser(w http.ResponseWriter, r *http.Request) {
	u := &struct {
		ID       json.Number `json:"id"`
		Username string      `json:"username"`
		Password string      `json:"password"`
		Name     string      `json:"name"`
		Email    string      `json:"email"`
	}{}
	err := json.NewDecoder(r.Body).Decode(&u)
	log.Printf("User Decoded: %+v", *u)
	if err != nil {
		e := &struct {
			Error string `json:"error"`
		}{err.Error()}
		json.NewEncoder(w).Encode(e)
		return
	}
	// u := &models.User{}
	// sid := r.Param("id")
	// id, err := strconv.ParseUint(sid, 10, 64)
	// user, err := uc.userInteractor.Update(u, uint(id))
	// if err != nil {
	// 	return err
	// }
	// return json.NewEncoder(w).Encode(newUser)
	return
}
