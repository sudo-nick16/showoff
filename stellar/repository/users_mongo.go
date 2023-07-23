package repository

import (
	"context"
	"errors"

	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo struct {
	coll *mongo.Collection
}

func NewUserRepo(client *mongo.Client, config *types.Config) *UserRepo {
	coll := client.Database(config.DbName).Collection("users")
	return &UserRepo{
		coll: coll,
	}
}

func (r *UserRepo) Create(user *types.User) (*types.User, error) {
	res := r.coll.FindOne(context.TODO(), bson.M{"user_id": user.ID})
	if res.Err() == nil {
		return nil, errors.New("User already exists.")
	}
	newUser, err := r.coll.InsertOne(context.TODO(), user)
	if err != nil {
		return nil, err
	}
	user.ID = newUser.InsertedID.(primitive.ObjectID)
	return user, nil
}

func (r *UserRepo) Update(user *types.User) (*types.User, error) {
	filter := bson.M{"user_id": user.UserId}
	update := bson.M{"$set": bson.M{
		"username": user.Username,
		"name":     user.Name,
	}}
	res := r.coll.FindOneAndUpdate(context.TODO(), filter, update)
	if res.Err() != nil {
		return nil, errors.New("User not found.")
	}
	return user, nil
}
