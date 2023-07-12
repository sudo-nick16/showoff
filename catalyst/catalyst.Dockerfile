FROM golang:1.19-alpine as build

WORKDIR /showoff/catalyst

COPY go.mod ./ 
COPY go.sum ./

RUN go mod download
RUN apk add alpine-sdk

COPY . .

RUN go build -v -o ./bin/catalyst

#stage
FROM golang:1.19-alpine

ENV ENV=development

WORKDIR /showoff/catalyst

COPY --from=build /showoff/catalyst/bin ./

CMD ["./catalyst"]
