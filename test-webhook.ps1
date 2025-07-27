# PowerShell script to test webhook endpoints
# Run this with: .\test-webhook.ps1

Write-Host "Testing webhook endpoints..." -ForegroundColor Green
Write-Host "Make sure your Next.js app is running on localhost:3000" -ForegroundColor Yellow

$webhookUrl = "http://localhost:3000/api/events/webhook"

# Test new job payload
$newJobPayload = @{
    event = "new-job"
    data = @{
        id = Get-Random -Maximum 1000
        title = "Test Job $(Get-Date -Format 'HH:mm:ss')"
        status = "new"
        contractor = $null
        latitude = 40.7128 + ((Get-Random) / [int]::MaxValue - 0.5) * 0.1
        longitude = -74.0060 + ((Get-Random) / [int]::MaxValue - 0.5) * 0.1
        address = "$((Get-Random -Maximum 999)) Test St, New York, NY"
    }
} | ConvertTo-Json -Depth 3

# Test status update payload
$statusUpdatePayload = @{
    event = "status-update"
    data = @{
        id = 1
        title = "Updated Test Job"
        status = "assigned"
        contractor = "John Doe"
        latitude = 40.7128
        longitude = -74.0060
        address = "123 Updated St, New York, NY"
    }
} | ConvertTo-Json -Depth 3

try {
    Write-Host "`n1. Testing new job webhook..." -ForegroundColor Cyan
    $response1 = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $newJobPayload -ContentType "application/json"
    Write-Host "Response: $($response1 | ConvertTo-Json)" -ForegroundColor Green
    
    Start-Sleep -Seconds 2
    
    Write-Host "`n2. Testing status update webhook..." -ForegroundColor Cyan
    $response2 = Invoke-RestMethod -Uri $webhookUrl -Method Post -Body $statusUpdatePayload -ContentType "application/json"
    Write-Host "Response: $($response2 | ConvertTo-Json)" -ForegroundColor Green
    
    Write-Host "`nWebhook tests completed successfully!" -ForegroundColor Green
}
catch {
    Write-Host "Error testing webhook: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Make sure your Next.js development server is running!" -ForegroundColor Yellow
}
