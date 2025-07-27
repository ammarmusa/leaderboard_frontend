# Comprehensive test script for the leaderboard system
# Run this script to test all functionality

Write-Host "🚀 Testing Leaderboard System" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

# Test 1: Check if jobs API is accessible
Write-Host "`n1. Testing Jobs API..." -ForegroundColor Cyan
try {
    $jobs = Invoke-RestMethod -Uri "http://localhost:3002/api/jobs" -Method Get
    Write-Host "✅ Jobs API working - Found $($jobs.Count) jobs" -ForegroundColor Green
} catch {
    Write-Host "❌ Jobs API failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Test 2: Check if webhook endpoint is working
Write-Host "`n2. Testing Webhook Endpoint..." -ForegroundColor Cyan
$webhookUrl = 'http://localhost:3002/api/events/webhook'
$testPayload = @{
    event = "new-job"
    data = @{
        id = 999
        title = "Test Emergency Repair"
        type = 5
        status = "new"
        contractor = $null
        latitude = "3.1390"
        longitude = "101.6869"
        address = "Test Location, Kuala Lumpur"
    }
} | ConvertTo-Json -Depth 3

try {
    $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $testPayload -ContentType 'application/json'
    Write-Host "✅ Webhook working - Response: $($response.message)" -ForegroundColor Green
} catch {
    Write-Host "❌ Webhook failed: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 3: Check different job statuses
Write-Host "`n3. Testing Different Job Statuses..." -ForegroundColor Cyan

$statuses = @("assigned", "in_progress", "completed")
foreach ($status in $statuses) {
    $statusPayload = @{
        event = "status-update"
        data = @{
            id = 999
            title = "Test Emergency Repair"
            type = 5
            status = $status
            contractor = "Test Contractor"
            latitude = "3.1390"
            longitude = "101.6869"
            address = "Test Location, Kuala Lumpur"
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $statusPayload -ContentType 'application/json'
        Write-Host "✅ Status update to '$status' successful" -ForegroundColor Green
        Start-Sleep -Seconds 1
    } catch {
        Write-Host "❌ Status update to '$status' failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

# Test 4: Verify contractor assignments work
Write-Host "`n4. Testing Contractor Assignments..." -ForegroundColor Cyan
$contractors = @("Alice Johnson", "Bob Smith", "Carol Davis")
foreach ($contractor in $contractors) {
    $contractorPayload = @{
        event = "status-update"
        data = @{
            id = (Get-Random -Maximum 100)
            title = "Contractor Test Job for $contractor"
            type = (Get-Random -Minimum 1 -Maximum 5)
            status = "assigned"
            contractor = $contractor
            latitude = (3.0 + (Get-Random) * 0.5).ToString("F6")
            longitude = (101.0 + (Get-Random) * 0.7).ToString("F6")
            address = "Test Address for $contractor"
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $contractorPayload -ContentType 'application/json'
        Write-Host "✅ Job assigned to '$contractor' successfully" -ForegroundColor Green
        Start-Sleep -Seconds 0.5
    } catch {
        Write-Host "❌ Assignment to '$contractor' failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 All tests completed!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host "📍 Map: http://localhost:3002" -ForegroundColor Yellow
Write-Host "🔧 Jobs API: http://localhost:3002/api/jobs" -ForegroundColor Yellow
Write-Host "📡 Webhook: http://localhost:3002/api/events/webhook" -ForegroundColor Yellow
Write-Host "📊 SSE Events: http://localhost:3002/api/events" -ForegroundColor Yellow
Write-Host "`nCheck your browser to see the live updates on the map and sidebar!" -ForegroundColor Cyan
