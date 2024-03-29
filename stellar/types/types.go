package types

import (
	"crypto/rsa"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type KafkaConfig struct {
	Brokers []string
	Topic   string
	GroupId string
}

type Config struct {
	MongoURI        string
	DbName          string
	ServerURI       string
	Port            string
	Origin          string
	AccessPublicKey *rsa.PublicKey
	KafkaConfig     *KafkaConfig
}

type User struct {
	ID           primitive.ObjectID `json:"id" bson:"_id,omitempty"`
	UserId       int                `json:"user_id" bson:"user_id,omitempty"`
	Username     string             `json:"username" bson:"username,omitempty"`
	Name         string             `json:"name" bson:"name,omitempty"`
	Email        string             `json:"email" bson:"email,omitempty"`
}

type Project struct {
	Id          primitive.ObjectID  `json:"_id" bson:"_id,omitempty"`
	Title       string              `json:"title" bson:"title,omitempty"`
	Slug        string              `json:"slug" bson:"slug,omitempty"`
	Image       string              `json:"img" bson:"img,omitempty"`
	Tagline     string              `json:"tagline" bson:"tagline,omitempty"`
	Description string              `json:"description" bson:"description,omitempty"`
	Upvotes     int                 `json:"upvotes" bson:"upvotes,omitempty"`
	Downvotes   int                 `json:"downvotes" bson:"downvotes,omitempty"`
	GithubURL   string              `json:"github_url" bson:"github_url,omitempty"`
	HostedURL   string              `json:"hosted_url" bson:"hosted_url,omitempty"`
	Tech        []string            `json:"tech" bson:"tech,omitempty"`
	UserId      int                 `json:"user_id" bson:"user_id,omitempty"`
	Username    string              `json:"username" bson:"username,omitempty"`
	CreatedAt   primitive.DateTime `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt   primitive.DateTime `json:"updated_at" bson:"updated_at,omitempty"`
}

type Post struct {
	Id        primitive.ObjectID  `json:"_id" bson:"_id,omitempty"`
	Title     string              `json:"title" bson:"title,omitempty"`
	Slug      string              `json:"slug" bson:"slug,omitempty"`
	Body      string              `json:"body" bson:"body,omitempty"`
	UserId    int                 `json:"user_id" bson:"user_id,omitempty"`
	Username  string              `json:"username" bson:"username,omitempty"`
	ProjectId primitive.ObjectID  `json:"project_id" bson:"project_id,omitempty"`
	CreatedAt primitive.DateTime `json:"created_at" bson:"created_at,omitempty"`
	UpdatedAt primitive.DateTime `json:"updated_at" bson:"updated_at,omitempty"`
}

type AuthTokenClaims struct {
	UserId       int    `json:"user_id"`
	Username     string `json:"username"`
	TokenVersion int    `json:"tokenVersion"`
	Exp          int    `json:"exp"`
}
