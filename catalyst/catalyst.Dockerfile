FROM golang:1.19-alpine as build

WORKDIR /showoff/catalyst

COPY go.mod ./ 
COPY go.sum ./

RUN go mod download

COPY . .

RUN go build -v -o ./bin/main ./main.go

#stage
FROM alpine:3.17

ENV ENV=development

WORKDIR /showoff/catalyst

COPY --from=build /showoff/catalyst/bin ./

CMD ["./main"]
