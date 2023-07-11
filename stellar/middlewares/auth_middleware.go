package middlewares

import (
	"errors"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
	"github.com/sudo-nick16/showoff/stellar/types"
	"go.mongodb.org/mongo-driver/bson/primitive"
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
			return []byte(config.AccessPublicKey), nil
		})
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, "token is invalid")
		}
		tokenClaims := token.Claims.(jwt.MapClaims)
		if tokenClaims["userId"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		if tokenClaims["exp"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		if tokenClaims["tokenVersion"] == nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		uid, err := primitive.ObjectIDFromHex(tokenClaims["userId"].(string))
		if err != nil {
			return fiber.NewError(fiber.StatusForbidden, "invalid token")
		}
		authContext := &types.AuthTokenClaims{
			UserId:       uid,
			Username:     tokenClaims["username"].(string),
			TokenVersion: int(tokenClaims["tokenVersion"].(float64)),
			Exp:          int64(tokenClaims["exp"].(float64)),
		}
		c.Locals("AuthContext", authContext)
		return c.Next()
	}
}
