targetScope = 'subscription'

@allowed([
  'staging'
  'production'
])
param environment string

param location string = 'eastus2'
param namePrefix string = 'ecommercemf'
param appServiceSku string = 'B1'

resource environmentResourceGroup 'Microsoft.Resources/resourceGroups@2024-03-01' = {
  name: 'rg-${namePrefix}-${environment}'
  location: location
  tags: {
    application: 'ecommerce-mf'
    environment: environment
    managedBy: 'bicep'
  }
}

module environmentResources './environment.bicep' = {
  name: 'ecommerce-mf-${environment}'
  scope: environmentResourceGroup
  params: {
    environment: environment
    location: location
    namePrefix: namePrefix
    appServiceSku: appServiceSku
  }
}

output resourceGroupName string = environmentResourceGroup.name
output apiAppName string = environmentResources.outputs.apiAppName
output apiUrl string = environmentResources.outputs.apiUrl
output storageAccountNames object = environmentResources.outputs.storageAccountNames
output frontendUrls object = environmentResources.outputs.frontendUrls
