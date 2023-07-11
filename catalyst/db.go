package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type repo struct {
	conn *sql.DB
}

type Repo interface {
	IncreaseOffset() error
	GetOffset() (int64, error)
}

func NewConn() (*sql.DB, error) {
	database_name := "kafka.db"
	db, err := sql.Open("sqlite3", database_name)
	if err != nil {
		return nil, err
	}
	sqlStmt := `
        create table
        if not exists
        kafka 
        (offset bigint not null default 0);
	`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		fmt.Printf("error: %q\n", err)
		return nil, err
	}

	queryRowCount := "select count(*) from kafka;"
	var count int64
	err = db.QueryRow(queryRowCount).Scan(&count)
	if err != nil {
		fmt.Printf("error: %q\n", err)
		return nil, err
	}
	fmt.Printf("count: %d\n", count)
	if count < 1 {
		sqlStmt := "insert into kafka values(0);"
		_, err = db.Exec(sqlStmt)
		if err != nil {
			fmt.Printf("error: %q\n", err)
			return nil, err
		}
	}
	return db, nil
}

func NewRepo(conn *sql.DB) Repo {
	return &repo{
		conn,
	}
}

func (r *repo) IncreaseOffset() error {
	sqlStmt := "update kafka set offset += 1"
	_, err := r.conn.Exec(sqlStmt)
	fmt.Printf("%q: %s\n", err, sqlStmt)
	return err
}

func (r *repo) GetOffset() (int64, error) {
	sqlStmt := "select * from kafka"
	var offset int64
	err := r.conn.QueryRow(sqlStmt).Scan(&offset)
	if err != nil {
		fmt.Printf("%q: %s\n", err, sqlStmt)
		return 0, err
	}
	return offset, nil
}
