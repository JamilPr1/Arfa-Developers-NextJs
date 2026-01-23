/**
 * Test Supabase Connection
 * Run with: node scripts/test-supabase.js
 */

async function testSupabaseConnection() {
  console.log('🧪 Testing Supabase Connection...\n')

  // Try to load .env.local if it exists (optional)
  try {
    const fs = require('fs')
    const path = require('path')
    const envPath = path.join(process.cwd(), '.env.local')
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, 'utf8')
      envContent.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/)
        if (match) {
          const key = match[1].trim()
          const value = match[2].trim().replace(/^["']|["']$/g, '')
          if (!process.env[key]) {
            process.env[key] = value
          }
        }
      })
    }
  } catch (e) {
    // Ignore if .env.local doesn't exist or can't be read
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log('📋 Environment Variables:')
  console.log(`   URL: ${supabaseUrl ? '✅ Set' : '❌ Missing'}`)
  console.log(`   Anon Key: ${supabaseAnonKey ? '✅ Set' : '❌ Missing'}`)
  console.log(`   Service Role Key: ${supabaseServiceKey ? '✅ Set' : '❌ Missing'}\n`)

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Missing required environment variables!')
    console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY')
    process.exit(1)
  }

  try {
    // Dynamically import Supabase
    const { createClient } = await import('@supabase/supabase-js')

    // Test with anon key
    console.log('🔐 Testing connection with Anon Key...')
    const supabase = createClient(supabaseUrl, supabaseAnonKey)
    
    // Test connection by querying a table (this will fail if tables don't exist, which is expected)
    const { data: projects, error: projectsError } = await supabase
      .from('projects')
      .select('count')
      .limit(1)

    if (projectsError && projectsError.code === 'PGRST116') {
      console.log('   ⚠️  Projects table does not exist yet (this is OK if you haven\'t created tables)')
    } else if (projectsError) {
      console.log(`   ⚠️  Error: ${projectsError.message}`)
    } else {
      console.log('   ✅ Successfully connected to Supabase!')
    }

    // Test with service role key if available
    if (supabaseServiceKey) {
      console.log('\n🔐 Testing connection with Service Role Key...')
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })

      const { data: storageBuckets, error: storageError } = await supabaseAdmin.storage
        .listBuckets()

      if (storageError) {
        console.log(`   ⚠️  Storage error: ${storageError.message}`)
      } else {
        console.log(`   ✅ Successfully connected with Service Role Key!`)
        console.log(`   📦 Found ${storageBuckets?.length || 0} storage bucket(s)`)
        
        // Check if talent-images bucket exists
        const talentBucket = storageBuckets?.find(b => b.name === 'talent-images')
        if (talentBucket) {
          console.log('   ✅ talent-images bucket exists!')
        } else {
          console.log('   ⚠️  talent-images bucket not found (create it in Supabase Dashboard)')
        }
      }
    } else {
      console.log('\n⚠️  Service Role Key not set - skipping admin operations test')
    }

    console.log('\n✅ Supabase connection test completed!')
    console.log('\n📝 Next Steps:')
    console.log('   1. Create database tables (see NEW_SUPABASE_SETUP.md)')
    console.log('   2. Create talent-images storage bucket')
    console.log('   3. Set environment variables in Vercel')
    console.log('   4. Test admin panel functionality')

  } catch (error) {
    console.error('\n❌ Error testing Supabase connection:')
    console.error(`   ${error.message}`)
    if (error.message.includes('Cannot find module')) {
      console.error('\n   💡 Run: npm install @supabase/supabase-js')
    }
    process.exit(1)
  }
}

testSupabaseConnection()
