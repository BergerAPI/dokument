package main

import (
	"fmt"
	"github.com/BergerAPI/dokument/manifest"
	"sigs.k8s.io/yaml"
)

func main() {
	data, err := yaml.Marshal(manifest.GenerateDeployment(manifest.NewDeploymentConfig("test", "nginx:latest")))
	if err != nil {
		println("error marshalling YAML: %w", err)
	}
	fmt.Println(string(data))
}
