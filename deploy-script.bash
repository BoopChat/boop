#!/bin/bash

npm run make-yaml-secrets
kubectl --kubeconfig="$1" apply -f boop-secret.yaml
kubectl --kubeconfig="$1" create -f boop-deployment.yaml
kubectl --kubeconfig="$1" apply -f boop-service.yaml
