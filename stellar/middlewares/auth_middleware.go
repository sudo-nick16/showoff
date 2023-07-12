package middlewares

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sudo-nick16/showoff/stellar/types"
)

func AuthMiddleware(config *types.Config) fiber.Handler {
	return func(c *fiber.Ctx) error {
		tokenFromHeader := c.GetReqHeaders()["Authorization"]

		if tokenFromHeader == "" {
			return fiber.NewError(fiber.StatusForbidden, "authorization header missing.")
		}
		headerParts := strings.Split(tokenFromHeader, " ")
		if len(headerParts) < 2 {
			return fiber.NewError(fiber.StatusForbidden, "invalid authorization header.")
		}
		accessToken := headerParts[1]

		token, err := jwt.Parse(accessToken, func(t *jwt.Token) (interface{}, error) {
			if t.Method.Alg() != jwt.SigningMethodRS256.Alg() {
				return nil, errors.New("invalid token")
			}
			return config.AccessPublicKey, nil
		})
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, "token is invalid")
		}
		tokenClaims := token.Claims.(jwt.MapClaims)
		if tokenClaims["user_id"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		if tokenClaims["exp"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		if tokenClaims["tokenVersion"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		if tokenClaims["username"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		authContext := &types.AuthTokenClaims{
			UserId:       int(tokenClaims["user_id"].(float64)),
			Username:     tokenClaims["username"].(string),
			TokenVersion: int(tokenClaims["tokenVersion"].(float64)),
			Exp:          int(tokenClaims["exp"].(float64)),
		}
		c.Locals("AuthContext", authContext)
		return c.Next()
	}
}
