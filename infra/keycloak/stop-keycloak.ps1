$ErrorActionPreference = 'SilentlyContinue'

$procs = Get-CimInstance Win32_Process |
  Where-Object {
    $_.Name -match '^java(\.exe)?$' -and
    $_.CommandLine -like '*keycloak-26.0.7*' -and
    $_.CommandLine -like '*start-dev*'
  }

if (-not $procs) {
  Write-Host 'No se encontro un proceso de Keycloak activo.'
  exit 0
}

foreach ($proc in $procs) {
  Stop-Process -Id $proc.ProcessId -Force
  Write-Host "Keycloak detenido. PID: $($proc.ProcessId)"
}
