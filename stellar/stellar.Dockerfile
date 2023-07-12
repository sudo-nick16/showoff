FROM golang:1.19-alpine as build

WORKDIR /showoff/stellar

COPY go.mod ./ 
COPY go.sum ./

RUN go mod download

COPY . .

RUN go build -v -o ./bin/stellar

#stage
FROM golang:1.19-alpine

ENV ENV=development

WORKDIR /showoff/stellar

COPY --from=build /showoff/stellar/bin ./

CMD ["./stellar"]
