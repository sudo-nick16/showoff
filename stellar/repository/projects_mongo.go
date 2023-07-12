package repository

import (
	"context"
	"errors"

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
	slugTitle := slug.Make(e.Title)
	filter := bson.M{
		"$and": bson.A{
			bson.M{"title": slugTitle},
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
	var projects []types.Project
	cur, err := r.coll.Find(context.TODO(), filter)
	if err != nil {
		return nil, errors.New("Could not find project.")
	}
	for cur.Next(context.TODO()) {
		var p types.Project
		err := cur.Decode(&p)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return &projects, nil
}

func (r *ProjectRepo) Delete(id string, userId string) error {
	filter := bson.M{
		"$and": bson.M{
			"_id":     id,
			"user_id": userId,
		},
	}
	_, err := r.coll.DeleteOne(context.TODO(), filter)
	if err != nil {
		return errors.New("Could not delete project.")
	}
	return nil
}

func (r *ProjectRepo) UpdateTitle(id string, title string) error {
	_, err := r.coll.UpdateByID(context.TODO(), id, bson.M{"$set": bson.M{"title": title}})
	if err != nil {
		return errors.New("Could not update project title.")
	}
	return nil
}

func (r *ProjectRepo) Update(id string, userId string, e *types.Project) error {
	filter := bson.M{
		"$and": bson.A{
			bson.M{"_id": e.Id},
			bson.M{"user_id": e.UserId},
		},
	}
	err := r.coll.FindOneAndUpdate(context.TODO(), filter, bson.M{"$set": bson.M{
		"title":       e.Title,
		"description": e.Description,
		"tech":        e.Tech,
		"github_url":  e.GithubURL,
		"hosted_url":  e.HostedURL,
		"updated_at":  e.UpdatedAt,
	}})
	if err != nil {
		return errors.New("Could not update project.")
	}
	return nil
}

func (r *ProjectRepo) UpdateUsername(id int, username string) error {
	_, err := r.coll.UpdateMany(context.TODO(), bson.M{
		"user_id": id,
	}, bson.M{"$set": bson.M{
		"username": username,
	}})
	if err != nil {
		return errors.New("Could not update username.")
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
