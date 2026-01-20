# Hotjar Setup with Google Tag Manager

Hotjar is now configured to be installed via Google Tag Manager instead of a direct script.

## Your Hotjar Tag ID
**Tag ID:** `9e555ac46ce75`

## Setup Instructions in Google Tag Manager

### Step 1: Create a New Tag

1. Log in to [Google Tag Manager](https://tagmanager.google.com)
2. Select your container: **GTM-WGSQ38FK**
3. Click **Tags** in the left sidebar
4. Click **New** to create a new tag

### Step 2: Configure the Tag

1. **Tag Configuration:**
   - Click **Tag Configuration**
   - Select **Custom HTML**

2. **HTML Code:**
   Paste the following code in the HTML field:

   ```html
   <script>
     (function(h,o,t,j,a,r){
       h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
       // IMPORTANT: This ID is alphanumeric, so it MUST be quoted as a string.
       h._hjSettings={hjid:'9e555ac46ce75',hjsv:6};
       a=o.getElementsByTagName('head')[0];
       r=o.createElement('script');r.async=1;
       r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
       a.appendChild(r);
     })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
   </script>
   ```

3. **Tag Name:**
   - Name it: **Hotjar - Site Tracking**

### Step 3: Set Trigger

1. Click **Triggering**
2. Select **All Pages** (or create a custom trigger if needed)
3. This ensures Hotjar loads on all pages

### Step 4: Save and Publish

1. Click **Save**
2. Click **Submit** to publish your changes
3. Add a version name: "Added Hotjar tracking"
4. Click **Publish**

## Verification

After publishing:

1. Visit your website
2. Open browser DevTools (F12)
3. Go to **Network** tab
4. Filter by "hotjar"
5. You should see requests to `hotjar.com`

Or check in Hotjar dashboard:
- Go to [Hotjar Dashboard](https://insights.hotjar.com)
- Navigate to **Sites** → Your site
- You should see recording data within a few minutes

## Benefits of Using GTM

- ✅ Centralized tag management
- ✅ Easy to enable/disable without code changes
- ✅ Better control over when tags load
- ✅ Can set up triggers based on user behavior
- ✅ Easier to manage multiple tracking tools

## Troubleshooting

**Hotjar not loading?**
- Check GTM container is published
- Verify tag is set to trigger on "All Pages"
- Check browser console for errors
- Ensure GTM is loading correctly on your site

**Need to update Hotjar settings?**
- Edit the tag in GTM
- Update the `hjid` value if your Hotjar ID changes
- Save and publish

## Additional Configuration

You can also configure Hotjar to:
- Track specific pages only (create custom triggers)
- Exclude certain pages
- Set up heatmap triggers
- Configure session recordings

All of this can be done in GTM without touching your code!
