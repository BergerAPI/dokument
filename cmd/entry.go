package main

import (
	"fmt"
	"github.com/BergerAPI/dokument/config"
	"github.com/BergerAPI/dokument/manifest"
	"log"
	"os"
	"sigs.k8s.io/yaml"
)

func main() {
	if len(os.Args) != 2 {
		log.Fatal("Please provide a config file (example: dokument test-dokument.yml)")
	}

	cfg, err := config.LoadConfig(os.Args[1])
	if err != nil {
		log.Fatal("Please provide a valid config file (example: dokument test-dokument.yml)")
	}

	for name, service := range cfg.Services {
		deployment := manifest.NewDeploymentConfig(name, service.Image)
		deployment.Replicas = service.Replicas

		data, err := yaml.Marshal(manifest.GenerateDeployment(deployment))
		if err != nil {
			println("error marshalling YAML: %w", err)
		}

		fmt.Println(string(data))
	}
}
