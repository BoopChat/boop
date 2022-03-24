#!/bin/bash

kubectl --kubeconfig="$1" apply -f secret.yaml
kubectl --kubeconfig="$1" create -f boop-deployment.yaml
kubeconfig="$1" apply -f boop-service.yaml