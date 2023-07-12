FROM golang:1.19-alpine as build

WORKDIR /showoff/nimbus

COPY go.mod ./ 
COPY go.sum ./

RUN go mod download

COPY . .

RUN go build -v -o ./bin/nimbus

#stage
FROM golang:1.19-alpine

ENV ENV=development

WORKDIR /showoff/nimbus

COPY --from=build /showoff/nimbus/bin ./

CMD ["./nimbus"]
