# Setup kubeconfig

This is a github action utility for setting up kubeconfig for use in github action workflows. It is intended to be used along side [azure/setup-kubectl](https://github.com/Azure/setup-kubectl), which install kubectl on the runner. 

**Sample workflow to install kubectl and kubeconfig**

```yaml
- uses: azure/setup-kubectl@v2.0
  with:
    version: '<version>' # default is latest stable
- uses: siteimprove/setup-kubeconfig@v1
  with: 
    CONFIG_YAML: ${{ secrets.YOUR_KUBECONFIG }}
    DEPLOYER_TOKEN: ${{ secrests.YOUR_DEPLOYER_USER_TOKEN }}
    NAMESPACE: <default namespace> (optional)
    CONTEXT: <default context> (optional)
```

## Notes on config_yaml

The parameter **config_yaml** is a templated version of your kubeconfig

```yaml
apiVersion: v1
kind: Config
preferences: {}
current-context: ${ CONTEXT }
contexts:
- name: your-context
  context:
    user: deployer
    cluster: your-cluster
    namespace: ${ NAMESPACE }
- ...
clusters:
- name: your-cluster
  cluster:
    server: <your-cluster-url>
    certificate-authority-data: <your-cluster-certificate>
- ...
users:
- name: deployer
  user:
    token: ${ DEPLOYER_TOKEN }
```

All the placeholders `${ ... }` are replaced, and the kubeconfig is stored in `$HOME/.kube/config` on the runner