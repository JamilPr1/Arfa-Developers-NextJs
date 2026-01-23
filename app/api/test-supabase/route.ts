import { NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    const results: any = {
      env: {
        url: supabaseUrl ? '✅ Set' : '❌ Missing',
        anonKey: supabaseAnonKey ? '✅ Set' : '❌ Missing',
        serviceKey: supabaseServiceKey ? '✅ Set' : '❌ Missing',
      },
      connection: {},
      storage: {},
      tables: {},
    }

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({
        success: false,
        error: 'Missing required environment variables',
        ...results,
      }, { status: 400 })
    }

    // Test connection with anon key
    try {
      const supabase = await getSupabaseClient()
      if (supabase) {
        results.connection.status = '✅ Connected'
        
        // Test projects table
        const { data: projects, error: projectsError } = await supabase
          .from('projects')
          .select('count')
          .limit(1)

        if (projectsError) {
          if (projectsError.code === 'PGRST116') {
            results.tables.projects = '⚠️ Table does not exist (create it in Supabase)'
          } else {
            results.tables.projects = `❌ Error: ${projectsError.message}`
          }
        } else {
          results.tables.projects = '✅ Table exists'
        }

        // Test talent table
        const { data: talent, error: talentError } = await supabase
          .from('talent')
          .select('count')
          .limit(1)

        if (talentError) {
          if (talentError.code === 'PGRST116') {
            results.tables.talent = '⚠️ Table does not exist (create it in Supabase)'
          } else {
            results.tables.talent = `❌ Error: ${talentError.message}`
          }
        } else {
          results.tables.talent = '✅ Table exists'
        }

        // Test storage buckets
        try {
          const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets()
          
          if (bucketsError) {
            results.storage.status = `❌ Error: ${bucketsError.message}`
          } else {
            results.storage.status = '✅ Connected'
            results.storage.buckets = buckets?.map((b: any) => b.name) || []
            results.storage.talentImagesBucket = buckets?.some((b: any) => b.name === 'talent-images')
              ? '✅ Exists'
              : '⚠️ Not found (create it in Supabase Dashboard)'
          }
        } catch (storageError: any) {
          results.storage.status = `❌ Error: ${storageError.message}`
        }
      } else {
        results.connection.status = '❌ Failed to initialize client'
      }
    } catch (error: any) {
      results.connection.status = `❌ Error: ${error.message}`
    }

    return NextResponse.json({
      success: true,
      message: 'Supabase connection test completed',
      ...results,
    })
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
    }, { status: 500 })
  }
}
