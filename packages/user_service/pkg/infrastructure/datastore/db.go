package datastore

import (
	"database/sql"
	"github.com/sudo-nick16/showoff/packages/user_service/pkg/config"
	"github.com/sudo-nick16/showoff/packages/user_service/types"
    _ "github.com/lib/pq"
)

func NewDB() (types.DB, error) {
	db, err := sql.Open("postgres", config.C.DBSource)
	if err != nil {
		return nil, err
	}
	// defer db.Close()
	return db, nil
}
