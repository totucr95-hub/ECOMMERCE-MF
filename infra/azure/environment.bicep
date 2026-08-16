@allowed([
  'staging'
  'production'
])
param environment string

param location string
param namePrefix string
param appServiceSku string

var frontendApps = [
  'shell'
  'landing'
  'shop'
  'admin'
  'auth'
]
var compactPrefix = take(toLower(replace(namePrefix, '-', '')), 10)
var environmentCode = environment == 'production' ? 'prd' : 'stg'
var uniqueSuffix = take(uniqueString(subscription().subscriptionId, resourceGroup().id), 6)
var storageAccountNames = [for app in frontendApps: take('${compactPrefix}${environmentCode}${take(app, 3)}${uniqueSuffix}', 24)]
var apiAppName = take('${compactPrefix}-${environmentCode}-api-${uniqueSuffix}', 60)

resource storageAccounts 'Microsoft.Storage/storageAccounts@2023-05-01' = [for (app, index) in frontendApps: {
  name: storageAccountNames[index]
  location: location
  tags: {
    application: 'ecommerce-mf'
    component: app
    environment: environment
  }
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
  }
}]

resource blobServices 'Microsoft.Storage/storageAccounts/blobServices@2023-05-01' = [for (app, index) in frontendApps: {
  parent: storageAccounts[index]
  name: 'default'
  properties: {
    cors: {
      corsRules: [
        {
          allowedHeaders: ['*']
          allowedMethods: [
            'GET'
            'HEAD'
            'OPTIONS'
          ]
          allowedOrigins: ['*']
          exposedHeaders: ['*']
          maxAgeInSeconds: 3600
        }
      ]
    }
    staticWebsite: {
      enabled: true
      indexDocument: 'index.html'
      error404Document: 'index.html'
    }
  }
}]

resource appServicePlan 'Microsoft.Web/serverfarms@2023-12-01' = {
  name: '${compactPrefix}-${environmentCode}-plan'
  location: location
  tags: {
    application: 'ecommerce-mf'
    environment: environment
  }
  kind: 'linux'
  sku: {
    name: appServiceSku
  }
  properties: {
    reserved: true
  }
}

resource apiApp 'Microsoft.Web/sites@2023-12-01' = {
  name: apiAppName
  location: location
  tags: {
    application: 'ecommerce-mf'
    component: 'api'
    environment: environment
  }
  kind: 'app,linux'
  properties: {
    serverFarmId: appServicePlan.id
    httpsOnly: true
    siteConfig: {
      alwaysOn: appServiceSku != 'F1'
      ftpsState: 'Disabled'
      linuxFxVersion: 'DOTNETCORE|10.0'
      minTlsVersion: '1.2'
      appSettings: [
        {
          name: 'ASPNETCORE_ENVIRONMENT'
          value: environment == 'production' ? 'Production' : 'Staging'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
      ]
    }
  }
}

output apiAppName string = apiApp.name
output apiUrl string = 'https://${apiApp.properties.defaultHostName}'
output storageAccountNames object = {
  shell: storageAccounts[0].name
  landing: storageAccounts[1].name
  shop: storageAccounts[2].name
  admin: storageAccounts[3].name
  auth: storageAccounts[4].name
}
output frontendUrls object = {
  shell: storageAccounts[0].properties.primaryEndpoints.web
  landing: storageAccounts[1].properties.primaryEndpoints.web
  shop: storageAccounts[2].properties.primaryEndpoints.web
  admin: storageAccounts[3].properties.primaryEndpoints.web
  auth: storageAccounts[4].properties.primaryEndpoints.web
}
