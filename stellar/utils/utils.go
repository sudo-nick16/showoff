package utils

import (
	"errors"

	"github.com/golang-jwt/jwt/v5"
	"github.com/sudo-nick16/showoff/stellar/types"
)

func verifyAccessToken(token string, config *types.Config) (*jwt.Token, error) {
	jwtToken, err := jwt.Parse(token, func(t *jwt.Token) (interface{}, error) {
		if t.Method.Alg() != jwt.SigningMethodRS256.Alg() {
			return nil, errors.New("invalid token")
		}
		return config.AccessPublicKey, nil
	})
	if err != nil {
		return jwtToken, err
	}
	return jwtToken, err
}
