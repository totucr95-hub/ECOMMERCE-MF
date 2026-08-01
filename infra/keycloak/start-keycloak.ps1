$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
$keycloakRoot = Join-Path $PSScriptRoot 'keycloak-26.0.7'
$realmFile = Join-Path $PSScriptRoot 'realm-ecommerce-mf.json'
$importDir = Join-Path $keycloakRoot 'data\import'
$javaHome = 'C:\Program Files\Eclipse Adoptium\jdk-21.0.12.8-hotspot'
$javaExe = Join-Path $javaHome 'bin\java.exe'

if (-not (Test-Path $keycloakRoot)) {
  throw "No se encontro Keycloak en '$keycloakRoot'."
}

if (-not (Test-Path $javaExe)) {
  throw "No se encontro Java en '$javaHome'. Instala Temurin 21 JDK."
}

New-Item -ItemType Directory -Path $importDir -Force | Out-Null
Copy-Item $realmFile (Join-Path $importDir 'realm-ecommerce-mf.json') -Force

$env:JAVA_HOME = $javaHome
$env:Path = "$javaHome\bin;$env:Path"
$env:KC_BOOTSTRAP_ADMIN_USERNAME = 'admin'
$env:KC_BOOTSTRAP_ADMIN_PASSWORD = 'admin123'

Set-Location $keycloakRoot

Write-Host 'Iniciando Keycloak en http://localhost:8080 ...'
Write-Host 'Usuario admin: admin'
Write-Host 'Password admin: admin123'

.\bin\kc.bat start-dev --http-port 8080 --import-realm
