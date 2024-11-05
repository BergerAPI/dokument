package main

import (
	"fmt"
	"github.com/BergerAPI/dokument/config"
	"github.com/BergerAPI/dokument/manifest"
	core "k8s.io/api/core/v1"
	"log"
	"os"
	"sigs.k8s.io/yaml"
	"strings"
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
		var envVars []core.EnvVar
		for _, env := range service.Env {
			parts := strings.SplitN(env, "=", 2)
			if len(parts) == 2 {
				envVars = append(envVars, core.EnvVar{Name: parts[0], Value: parts[1]})
			}
		}

		deployment := manifest.NewDeploymentConfig(name, service.Image)
		deployment.Replicas = service.Replicas
		deployment.EnvVars = envVars

		data, err := yaml.Marshal(manifest.GenerateDeployment(deployment))
		if err != nil {
			println("error marshalling YAML: %w", err)
		}

		fmt.Println(string(data))
	}
}
