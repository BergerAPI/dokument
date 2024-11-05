package manifest

import (
	apps "k8s.io/api/apps/v1"
	core "k8s.io/api/core/v1"
	meta "k8s.io/apimachinery/pkg/apis/meta/v1"
)

// DeploymentConfig holds the configuration for a Kubernetes Deployment
type DeploymentConfig struct {
	Namespace    string
	Name         string
	Image        string
	EnvVars      []core.EnvVar
	Volumes      []core.Volume
	VolumeMounts []core.VolumeMount
	Replicas     int32
}

// NewDeploymentConfig initializes DeploymentConfig with default values.
func NewDeploymentConfig(name, image string) DeploymentConfig {
	return DeploymentConfig{
		Namespace:    "default",
		Name:         name,
		Image:        image,
		EnvVars:      []core.EnvVar{},
		Volumes:      []core.Volume{},
		VolumeMounts: []core.VolumeMount{},
		Replicas:     1,
	}
}

// GenerateDeployment creates a Kubernetes Deployment for a database or service.
func GenerateDeployment(config DeploymentConfig) *apps.Deployment {
	return &apps.Deployment{
		ObjectMeta: meta.ObjectMeta{
			Name:      config.Name,
			Namespace: config.Namespace, // Set the namespace
			Labels: map[string]string{
				"app": config.Name,
			},
		},
		Spec: apps.DeploymentSpec{
			Replicas: &config.Replicas,
			Selector: &meta.LabelSelector{
				MatchLabels: map[string]string{
					"app": config.Name,
				},
			},
			Template: core.PodTemplateSpec{
				ObjectMeta: meta.ObjectMeta{
					Labels: map[string]string{
						"app": config.Name,
					},
				},
				Spec: core.PodSpec{
					Containers: []core.Container{
						{
							Name:         config.Name,
							Image:        config.Image,
							Env:          config.EnvVars,
							VolumeMounts: config.VolumeMounts,
						},
					},
					Volumes: config.Volumes,
				},
			},
		},
	}
}
