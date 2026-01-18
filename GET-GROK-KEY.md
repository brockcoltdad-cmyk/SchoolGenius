# GET SECOND GROK KEY FROM BITWARDEN

## Run these commands:

```bash
# 1. Open terminal (you're probably already in one)

# 2. Login to Bitwarden (if not already logged in)
bw login

# 3. Unlock vault (will ask for master password)
bw unlock

# 4. Copy the session key it gives you, then export it:
export BW_SESSION="paste-session-key-here"

# 5. Search for Grok keys
bw list items --search "grok" | grep -A 5 -B 5 "api"

# OR search for xAI
bw list items --search "xai" | grep -A 5 -B 5 "key"

# OR list all items and look for it
bw list items | grep -i "grok\|xai"
```

## If you see the keys, copy the SECOND one and paste it here!

The first key is: `YOUR_XAI_API_KEY_HERE` (check .env file)

I need the second one!
