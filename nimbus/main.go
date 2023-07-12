package main

import (
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
)

type ReverseProxy struct {
	url   *url.URL
	proxy *httputil.ReverseProxy
}

func main() {
	config := setupConfig()

	proxyMap := make(map[string]*ReverseProxy)

	for k, v := range config.Servers {
		url, err := url.Parse(v)
		if err != nil {
			panic(err)
		}
		proxyMap[k] = &ReverseProxy{
			url,
			httputil.NewSingleHostReverseProxy(url),
		}
	}

	handler := func() func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			var p *httputil.ReverseProxy
			var path = strings.Split(r.URL.Path, "/")[1]
			p = proxyMap[path].proxy
			r.Host = proxyMap[path].url.Host
			log.Println("Forwarding request to ", proxyMap[path].url.Host+r.URL.Path)
			p.ServeHTTP(w, r)
		}
	}

	http.HandleFunc("/", handler())

	err := http.ListenAndServe(":"+config.Port, nil)
	if err != nil {
		panic(err)
	}
}
