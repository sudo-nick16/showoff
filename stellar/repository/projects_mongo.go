package repository

import (
	"context"
	"errors"
	"log"
	"time"

	"github.com/gosimple/slug"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type ProjectRepo struct {
	coll     *mongo.Collection
	userColl *mongo.Collection
}

func NewProjectRepo(client *mongo.Client, config *types.Config) *ProjectRepo {
	coll := client.Database(config.DbName).Collection("projects")
	userColl := client.Database(config.DbName).Collection("users")
	return &ProjectRepo{
		coll:     coll,
		userColl: userColl,
	}
}

func (r *ProjectRepo) Create(e *types.Project) (*types.Project, error) {
	res := r.userColl.FindOne(context.TODO(), bson.M{"user_id": e.UserId})
	if res.Err() != nil {
		return nil, errors.New("User not found.")
	}
	e.CreatedAt = primitive.NewDateTimeFromTime(time.Now())
	e.UpdatedAt = primitive.NewDateTimeFromTime(time.Now())
	slugTitle := slug.Make(e.Title)
	filter := bson.M{
		"$and": bson.A{
			bson.M{"slug": slugTitle},
			bson.M{"user_id": e.UserId},
		},
	}
	res = r.coll.FindOne(context.TODO(), filter)
	if res.Err() == nil {
		return nil, errors.New("Project already exists.")
	}
	p, err := r.coll.InsertOne(context.TODO(), e)
	if err != nil {
		return nil, err
	}
	e.Id = p.InsertedID.(primitive.ObjectID)
	return e, nil
}

func (r *ProjectRepo) Get(id primitive.ObjectID) (*types.Project, error) {
	res := r.coll.FindOne(context.TODO(), bson.M{"_id": id})
	if res.Err() != nil {
		return nil, errors.New("Project not found.")
	}
	var project types.Project
	err := res.Decode(&project)
	if err != nil {
		return nil, err
	}
	return &project, nil
}

func (r *ProjectRepo) GetAllByUserId(userId int) (*[]types.Project, error) {
	filter := bson.M{
		"user_id": userId,
	}
	projects := []types.Project{}
	cur, err := r.coll.Find(context.TODO(), filter)
	if err != nil {
		return nil, errors.New("Could not find project.")
	}
	err = cur.All(context.TODO(), &projects)
	if err != nil {
		return &projects, err
	}
	return &projects, nil
}

func (r *ProjectRepo) GetAllByUsername(username string) (*[]types.Project, error) {
	filter := bson.M{
		"username": username,
	}
	projects := []types.Project{}
	cur, err := r.coll.Find(context.TODO(), filter)
	if err != nil {
		return nil, errors.New("Could not find project.")
	}
	err = cur.All(context.TODO(), &projects)
	if err != nil {
		return &projects, err
	}
	return &projects, nil
}

func (r *ProjectRepo) Delete(id primitive.ObjectID, userId int) error {
	filter := bson.M{
		"$and": bson.A{
			bson.M{
				"_id": id,
			},
			bson.M{
				"user_id": userId,
			},
		},
	}
	res, err := r.coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		log.Printf("error: %v", err)
		return err
	}
	if res.DeletedCount > 0 {
		return nil
	}
	return nil
}

func (r *ProjectRepo) Update(e *types.Project) error {
	filter := bson.M{
		"$and": bson.A{
			bson.M{"_id": e.Id},
			bson.M{"user_id": e.UserId},
		},
	}
	res := r.coll.FindOneAndUpdate(context.TODO(), filter, bson.M{"$set": bson.M{
		"title":       e.Title,
		"slug":        slug.Make(e.Title),
		"img":         e.Image,
		"tagline":     e.Tagline,
		"description": e.Description,
		"github_url":  e.GithubURL,
		"hosted_url":  e.HostedURL,
		"tech":        e.Tech,
		"updated_at":  primitive.NewDateTimeFromTime(time.Now()),
	}})
	if res.Err() != nil {
		log.Printf("error: %v", res.Err())
		return errors.New("Could not update project.")
	}
	return nil
}

func (r *ProjectRepo) GetByUserAndProjectId(uid int, projectId primitive.ObjectID) (*types.Project, error) {
	filter := bson.M{
		"$and": bson.A{
			bson.M{"user_id": uid},
			bson.M{"_id": projectId},
		},
	}
	project := &types.Project{}
	res := r.coll.FindOne(context.TODO(), filter)
	if res.Err() != nil {
		return nil, errors.New("Project not found.")
	}
	err := res.Decode(project)
	if err != nil {
		return nil, err
	}
	return project, nil
}

func (r *ProjectRepo) GetByUsernameAndProjectSlug(username, slug string) (*types.Project, error) {
	filter := bson.M{
		"$and": bson.A{
			bson.M{"username": username},
			bson.M{"slug": slug},
		},
	}
	project := &types.Project{}
	res := r.coll.FindOne(context.TODO(), filter)
	if res.Err() != nil {
		return nil, errors.New("Project not found.")
	}
	err := res.Decode(project)
	if err != nil {
		return nil, err
	}
	return project, nil
}
