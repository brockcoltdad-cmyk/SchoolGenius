@echo off
echo ========================================
echo Deploying analyze-syllabus Edge Function
echo ========================================
echo.

cd /d "%~dp0"

echo Checking Supabase CLI...
supabase --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Supabase CLI not found!
    echo Install it: npm install -g supabase
    exit /b 1
)

echo.
echo Deploying analyze-syllabus function...
echo.

npx supabase functions deploy analyze-syllabus --project-ref eczpdbkslqbduiesbqcm

if errorlevel 1 (
    echo.
    echo ERROR: Deployment failed!
    echo.
    echo Common fixes:
    echo 1. Make sure you're logged in: supabase login
    echo 2. Check project ref is correct
    echo 3. Verify function code has no syntax errors
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! Function deployed
echo ========================================
echo.
echo Next steps:
echo 1. Set environment variables in Supabase dashboard:
echo    - XAI_API_KEY (your xAI Grok API key)
echo.
echo 2. Test the function:
echo    - Scan a syllabus in the app
echo    - Check console logs in Supabase dashboard
echo    - Verify lessons appear in daily_schedule table
echo.

pause
