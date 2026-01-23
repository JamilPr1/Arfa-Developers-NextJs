// Supabase-based data storage utilities
import { getSupabaseClient } from './supabase'

/**
 * Read data from Supabase table
 */
export async function readDataFromSupabase<T>(tableName: string): Promise<T[]> {
  console.log(`📖 Reading ${tableName} from Supabase...`)
  
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      console.warn(`⚠️ Supabase not configured, skipping read for ${tableName}`)
      return []
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .order('id', { ascending: false })
    
    if (error) {
      console.error(`❌ Supabase read error for ${tableName}:`, error.message)
      return []
    }
    
    console.log(`✅ Read ${data?.length || 0} items from Supabase for ${tableName}`)
    return (data as T[]) || []
  } catch (error: any) {
    console.error(`❌ Error reading ${tableName} from Supabase:`, error?.message || error)
    return []
  }
}

/**
 * Write data to Supabase table (upsert - insert or update)
 * This is used for bulk operations where we replace all data
 */
export async function writeDataToSupabase<T extends { id?: number }>(
  tableName: string,
  items: T[]
): Promise<void> {
  console.log(`💾 Writing ${items.length} items to Supabase ${tableName}...`)
  
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    // Use upsert to insert or update items based on ID
    if (items.length > 0) {
      const { error: upsertError } = await supabase
        .from(tableName)
        .upsert(items, { onConflict: 'id' })
      
      if (upsertError) {
        console.error(`❌ Supabase upsert error for ${tableName}:`, upsertError.message)
        throw new Error(`Failed to write to Supabase: ${upsertError.message}`)
      }
    }
    
    console.log(`✅ Successfully wrote ${items.length} items to Supabase ${tableName}`)
  } catch (error: any) {
    console.error(`❌ Error writing ${tableName} to Supabase:`, error?.message || error)
    throw error
  }
}

/**
 * Insert a single item into Supabase table
 */
export async function insertDataToSupabase<T>(
  tableName: string,
  item: T
): Promise<T> {
  console.log(`➕ Inserting item into Supabase ${tableName}...`)
  
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .insert(item)
      .select()
      .single()
    
    if (error) {
      console.error(`❌ Supabase insert error for ${tableName}:`, error.message)
      throw new Error(`Failed to insert into Supabase: ${error.message}`)
    }
    
    console.log(`✅ Successfully inserted item into Supabase ${tableName}`)
    return data as T
  } catch (error: any) {
    console.error(`❌ Error inserting into ${tableName}:`, error?.message || error)
    throw error
  }
}

/**
 * Update a single item in Supabase table
 */
export async function updateDataInSupabase<T>(
  tableName: string,
  id: number,
  updates: Partial<T>
): Promise<T> {
  console.log(`✏️ Updating item ${id} in Supabase ${tableName}...`)
  
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { data, error } = await supabase
      .from(tableName)
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) {
      console.error(`❌ Supabase update error for ${tableName}:`, error.message)
      throw new Error(`Failed to update in Supabase: ${error.message}`)
    }
    
    if (!data) {
      throw new Error(`Talent not found`)
    }
    
    console.log(`✅ Successfully updated item ${id} in Supabase ${tableName}`)
    return data as T
  } catch (error: any) {
    console.error(`❌ Error updating ${tableName}:`, error?.message || error)
    throw error
  }
}

/**
 * Delete an item from Supabase table
 */
export async function deleteDataFromSupabase(
  tableName: string,
  id: number
): Promise<void> {
  console.log(`🗑️ Deleting item ${id} from Supabase ${tableName}...`)
  
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      throw new Error('Supabase not configured')
    }
    
    const { error } = await supabase
      .from(tableName)
      .delete()
      .eq('id', id)
    
    if (error) {
      console.error(`❌ Supabase delete error for ${tableName}:`, error.message)
      throw new Error(`Failed to delete from Supabase: ${error.message}`)
    }
    
    console.log(`✅ Successfully deleted item ${id} from Supabase ${tableName}`)
  } catch (error: any) {
    console.error(`❌ Error deleting from ${tableName}:`, error?.message || error)
    throw error
  }
}
