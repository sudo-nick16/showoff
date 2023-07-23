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

	proxyMap := make(map[string]ReverseProxy)

	for k, v := range config.Servers {
		url, err := url.Parse(v)
		if err != nil {
			log.Fatal("Error parsing url: ", err)
		}
		proxyMap[k] = ReverseProxy{
			url,
			httputil.NewSingleHostReverseProxy(url),
		}
	}

	handler := func() func(http.ResponseWriter, *http.Request) {
		return func(w http.ResponseWriter, r *http.Request) {
			log.Println("Request received for ", r.URL.Host+r.URL.Path, r.URL.Hostname())
			p := &httputil.ReverseProxy{}
			var path = strings.Split(r.URL.Path, "/")[1]
			if path == "" {
				log.Println("Invalid Path: ", path)
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			p = proxyMap[path].proxy
			if p == nil {
				log.Println("Path not found: ", path)
				w.WriteHeader(http.StatusBadRequest)
				return
			}
			log.Println("Path found: ", path)
			r.Host = proxyMap[path].url.Host
			r.URL.Path = strings.Replace(r.URL.Path, "/"+path, "", 1)
			log.Println("Forwarding request to ", r.Host)
			p.ServeHTTP(w, r)
		}
	}

	http.HandleFunc("/", handler())

	err := http.ListenAndServe(":"+config.Port, nil)
	if err != nil {
		log.Fatal("Error starting server: ", err)
	}
}
