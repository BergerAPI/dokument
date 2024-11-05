package manifest

import (
	"fmt"
	core "k8s.io/api/core/v1"
	v1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/util/intstr"
)

// ServiceConfig holds the configuration for a Kubernetes Service
type ServiceConfig struct {
	Namespace string
	Name      string
	Ports     []int32
	Type      core.ServiceType
}

// NewServiceConfig initializes ServiceConfig with default values.
func NewServiceConfig(name string, typ core.ServiceType) ServiceConfig {
	return ServiceConfig{
		Namespace: "default",
		Name:      name,
		Type:      typ,
		Ports:     []int32{},
	}
}

// GenerateService creates a Kubernetes Service for a database or service.
func GenerateService(config ServiceConfig) *core.Service {
	var ports []core.ServicePort
	for _, port := range config.Ports {
		svcPort := core.ServicePort{Port: port, TargetPort: intstr.FromInt32(port)}

		// If NodePort, allocate a NodePort within the default range if needed
		if config.Type == core.ServiceTypeNodePort {
			svcPort.NodePort = 30000 + (port % 10000) // Example to set a custom NodePort within range
		}

		ports = append(ports, svcPort)
	}

	return &core.Service{
		ObjectMeta: v1.ObjectMeta{
			Name:      fmt.Sprintf("%s-service", config.Name),
			Namespace: config.Namespace,
			Labels: map[string]string{
				"app": config.Name,
			},
		},
		Spec: core.ServiceSpec{
			Selector: map[string]string{
				"app": config.Name,
			},
			Ports: ports,
			Type:  config.Type,
		},
	}
}
