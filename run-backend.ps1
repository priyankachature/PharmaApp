Param(
    [switch]$ForceDownload
)

function Write-Info($msg){ Write-Host "[INFO] $msg" -ForegroundColor Cyan }
function Write-Err($msg){ Write-Host "[ERROR] $msg" -ForegroundColor Red }

# Check Java
if (-not (Get-Command java -ErrorAction SilentlyContinue)) {
    Write-Err "Java is not found. Install JDK 11+ and ensure 'java' is in PATH."
    exit 1
}
$javaVersion = java -version 2>&1 | Select-Object -First 1
Write-Info "Java detected: $javaVersion"

# Check mvn
if (Get-Command mvn -ErrorAction SilentlyContinue) {
    Write-Info "Maven detected in PATH."
    $mvnCmd = "mvn"
} else {
    $mavenVersion = "3.9.6"
    $mavenDir = Join-Path $PSScriptRoot ".maven\apache-maven-$mavenVersion"
    $mavenBin = Join-Path $mavenDir "bin\mvn.cmd"
    if ($ForceDownload -or -not (Test-Path $mavenBin)) {
        Write-Info "Maven not found. Downloading Apache Maven $mavenVersion..."
        $zipUrl = "https://dlcdn.apache.org/maven/maven-3/$mavenVersion/binaries/apache-maven-$mavenVersion-bin.zip"
        $zipPath = Join-Path $PSScriptRoot ".maven\apache-maven-$mavenVersion-bin.zip"
        New-Item -ItemType Directory -Path (Split-Path $zipPath) -Force | Out-Null
        Write-Info "Downloading $zipUrl to $zipPath ..."
        try {
            Invoke-WebRequest -Uri $zipUrl -OutFile $zipPath -UseBasicParsing
            Write-Info "Extracting..."
            Expand-Archive -Path $zipPath -DestinationPath (Join-Path $PSScriptRoot ".maven") -Force
            Remove-Item $zipPath -Force
        } catch {
            Write-Err "Failed to download or extract Maven: $_"
            exit 1
        }
    } else {
        Write-Info "Using existing Maven at $mavenDir"
    }
    $env:PATH = "$mavenDir\bin;$env:PATH"
    $mvnCmd = "mvn"
}

# Run backend
$backendPom = Join-Path $PSScriptRoot "backend\pom.xml"
if (-not (Test-Path $backendPom)) {
    Write-Err "backend/pom.xml not found in workspace root ($PSScriptRoot)."
    exit 1
}

Write-Info "Starting backend: mvn -f backend/pom.xml spring-boot:run"
& $mvnCmd -f $backendPom spring-boot:run
