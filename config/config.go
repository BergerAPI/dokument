package config

import (
	"os"
	"sigs.k8s.io/yaml"
)

// Config root node of the config
type Config struct {
	Services map[string]Service `yaml:"services"`
}

// Service defines a single deployment
type Service struct {
	Image    string   `yaml:"image"`
	Replicas int32    `yaml:"replicas"`
	Ports    []int32  `yaml:"ports"`
	Env      []string `yaml:"env"`
	Expose   string   `yaml:"expose"`
	Storage  Storage  `yaml:"storage"`
}

// Storage specifies the volume size of a pvc-claim for a service
type Storage struct {
	Size string `yaml:"size"`
}

// LoadConfig reads the configuration file to generate manifests from
func LoadConfig(filename string) (*Config, error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, err
	}

	var config Config
	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, err
	}

	return &config, nil
}
