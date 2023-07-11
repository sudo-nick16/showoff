package types

import "go.mongodb.org/mongo-driver/bson/primitive"

type Config struct {
	MongoURI        string `json:"mongoURI"`
	DbName          string `json:"dbName"`
	ServerURI       string `json:"serverURI"`
	Port            string `json:"port"`
	Origin          string `json:"origin"`
	AccessPublicKey string `json:"accessPublicKey"`
}

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserId       uint               `json:"user_id" bson:"user_id,omitempty"`
	Username     string             `json:"username" bson:"username,omitempty"`
	Name         string             `json:"name" bson:"name,omitempty"`
	Email        string             `json:"email" bson:"email,omitempty"`
	TokenVersion int                `json:"tokenVersion" bson:"tokenVersion,omitempty"`
}

type Project struct {
	Id          primitive.ObjectID  `json:"id" bson:"_id,omitempty"`
	Title       string              `json:"title" bson:"title,omitempty"`
	Image       string              `json:"img" bson:"img,omitempty"`
	Description string              `json:"description" bson:"description,omitempty"`
	Upvotes     int                 `json:"upvotes" bson:"upvotes,omitempty"`
	Downvotes   int                 `json:"downvotes" bson:"downvotes,omitempty"`
	GithubURL   string              `json:"github_url" bson:"github_url,omitempty"`
	HostedURL   string              `json:"hosted_url" bson:"hosted_url,omitempty"`
	Tech        []string            `json:"tech" bson:"tech,omitempty"`
	UserId      uint                `json:"user_id" bson:"user_id,omitempty"`
	Username    string              `json:"username" bson:"username,omitempty"`
	CreatedAt   primitive.Timestamp `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt   primitive.Timestamp `json:"updated_at" bson:"updated_at,omitempty"`
}

type AuthTokenClaims struct {
	UserId       primitive.ObjectID `json:"userId"`
	Username     string             `json:"username"`
	TokenVersion int                `json:"tokenVersion"`
	Exp          int64              `json:"exp"`
}
