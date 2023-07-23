package repository

import (
	"context"
	"errors"
	"time"

	"github.com/gosimple/slug"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type PostRepo struct {
	coll     *mongo.Collection
	projRepo *ProjectRepo
}

func NewPostRepo(client *mongo.Client, projectRepo *ProjectRepo, config *types.Config) *PostRepo {
	coll := client.Database(config.DbName).Collection("posts")
	return &PostRepo{
		coll:     coll,
		projRepo: projectRepo,
	}
}

func (r *PostRepo) Create(e *types.Post) (*types.Post, error) {
	p, err := r.projRepo.GetByUserAndProjectId(e.UserId, e.ProjectId)
	if err != nil {
		return nil, err
	}
	if p == nil {
		return nil, errors.New("Project not found.")
	}
	e.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	e.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	post, err := r.coll.InsertOne(context.TODO(), e)
	if err != nil {
		return nil, err
	}
	e.Id = post.InsertedID.(primitive.ObjectID)
	return e, nil
}

func (r *PostRepo) Get(id primitive.ObjectID) (*types.Post, error) {
	post := &types.Post{}
	res := r.coll.FindOne(context.TODO(), bson.M{
		"_id": id,
	})
	if res.Err() != nil {
		return nil, errors.New("Post not found.")
	}
	err := res.Decode(post)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (r *PostRepo) GetBySlug(slug string) (*types.Post, error) {
	return nil, nil
}

func (r *PostRepo) GetByUserId(userId int) ([]*types.Post, error) {
	posts := []*types.Post{}
	cursor, err := r.coll.Find(context.TODO(), bson.M{
		"user_id": userId,
	})
	if err != nil {
		return nil, err
	}
	err = cursor.All(context.Background(), &posts)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *PostRepo) GetAllByProjectId(projectId primitive.ObjectID) ([]*types.Post, error) {
	posts := []*types.Post{}
	cursor, err := r.coll.Find(context.TODO(), bson.M{
		"project_id": projectId,
	})
	if err != nil {
		return nil, err
	}
	err = cursor.All(context.Background(), &posts)
	if err != nil {
		return nil, err
	}
	return posts, nil
}

func (r *PostRepo) Delete(postId primitive.ObjectID, uid int) error {
	res, err := r.coll.DeleteOne(context.TODO(), bson.M{
		"_id":     postId,
		"user_id": uid,
	})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return errors.New("Post not found.")
	}
	return nil
}

func (r *PostRepo) DeleteByProjectId(projectId primitive.ObjectID) error {
	res, err := r.coll.DeleteMany(context.TODO(), bson.M{
		"project_id": projectId,
	})
	if err != nil {
		return err
	}
	if res.DeletedCount == 0 {
		return errors.New("Post not found.")
	}
	return nil
}

func (r *PostRepo) Update(e *types.Post) (*types.Post, error) {
	res, err := r.coll.UpdateOne(context.TODO(), bson.M{
		"_id":        e.Id,
		"project_id": e.ProjectId,
	}, bson.M{
		"$set": bson.M{
			"title":      e.Title,
			"slug":       slug.Make(e.Title),
			"body":       e.Body,
			"updated_at": primitive.NewDateTimeFromTime(time.Now()),
		},
	})
	if err != nil {
		return nil, err
	}
	if res.ModifiedCount == 0 {
		return nil, errors.New("Post not found.")
	}
	return e, nil
}
