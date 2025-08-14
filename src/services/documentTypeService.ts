import { supabase } from '../lib/supabase';
import { documentCategories, documentTypes, DocumentCategory } from '../utils/documentTypes';

export interface DatabaseCategory {
  id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DatabaseDocumentType {
  id: string;
  category_id: string;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

/**
 * Initialize document types in the database if they don't exist
 */
export const initializeDocumentTypes = async (): Promise<{ success: boolean; message: string }> => {
  try {
    // First, check if categories exist
    const { data: existingCategories, error: categoriesError } = await supabase
      .from('document_categories')
      .select('*');

    if (categoriesError) {
      console.error('Error checking existing categories:', categoriesError);
      return { success: false, message: 'Failed to check existing categories' };
    }

    // If no categories exist, insert them
    if (!existingCategories || existingCategories.length === 0) {
      const categoriesToInsert = documentCategories.map(cat => ({
        name: cat.name,
        description: cat.description
      }));

      const { error: insertCategoriesError } = await supabase
        .from('document_categories')
        .insert(categoriesToInsert);

      if (insertCategoriesError) {
        console.error('Error inserting categories:', insertCategoriesError);
        return { success: false, message: 'Failed to insert document categories' };
      }
    }

    // Get updated categories with IDs
    const { data: allCategories, error: getAllCategoriesError } = await supabase
      .from('document_categories')
      .select('*');

    if (getAllCategoriesError) {
      console.error('Error fetching categories:', getAllCategoriesError);
      return { success: false, message: 'Failed to fetch categories' };
    }

    // Check if document types exist
    const { data: existingTypes, error: typesError } = await supabase
      .from('document_types')
      .select('*');

    if (typesError) {
      console.error('Error checking existing types:', typesError);
      return { success: false, message: 'Failed to check existing document types' };
    }

    // If no types exist, insert them
    if (!existingTypes || existingTypes.length === 0) {
      const typesToInsert: Array<{ category_id: string; name: string; description: string }> = [];

      // Map static document types to database format
      documentTypes.forEach(type => {
        const dbCategory = allCategories?.find(cat => 
          cat.name === documentCategories.find(c => c.id === type.category_id)?.name
        );

        if (dbCategory) {
          typesToInsert.push({
            category_id: dbCategory.id,
            name: type.name,
            description: type.description
          });
        }
      });

      if (typesToInsert.length > 0) {
        // Insert in batches to avoid potential size limits
        const batchSize = 50;
        for (let i = 0; i < typesToInsert.length; i += batchSize) {
          const batch = typesToInsert.slice(i, i + batchSize);
          const { error: insertTypesError } = await supabase
            .from('document_types')
            .insert(batch);

          if (insertTypesError) {
            console.error('Error inserting document types batch:', insertTypesError);
            return { success: false, message: `Failed to insert document types batch ${i / batchSize + 1}` };
          }
        }
      }
    }

    return { 
      success: true, 
      message: `Document types initialized successfully. ${allCategories?.length || 0} categories and ${existingTypes?.length || documentTypes.length} types available.` 
    };

  } catch (error) {
    console.error('Error initializing document types:', error);
    return { success: false, message: 'Failed to initialize document types' };
  }
};

/**
 * Fetch document categories from database with fallback to static data
 */
export const fetchDocumentCategories = async (): Promise<DocumentCategory[]> => {
  try {
    const { data, error } = await supabase
      .from('document_categories')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching categories:', error);
      return documentCategories;
    }

    if (!data || data.length === 0) {
      // Try to initialize document types
      await initializeDocumentTypes();
      return documentCategories;
    }

    // Map database categories to our interface
    return data.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: documentCategories.find(c => c.name === cat.name)?.icon || '📄'
    }));

  } catch (error) {
    console.error('Error in fetchDocumentCategories:', error);
    return documentCategories;
  }
};

/**
 * Fetch document types from database with fallback to static data
 */
export const fetchDocumentTypes = async (): Promise<DatabaseDocumentType[]> => {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching document types:', error);
      return [];
    }

    if (!data || data.length === 0) {
      // Try to initialize document types
      await initializeDocumentTypes();
      return [];
    }

    return data;

  } catch (error) {
    console.error('Error in fetchDocumentTypes:', error);
    return [];
  }
};

/**
 * Get document types by category ID from database
 */
export const fetchDocumentTypesByCategory = async (categoryId: string): Promise<DatabaseDocumentType[]> => {
  try {
    const { data, error } = await supabase
      .from('document_types')
      .select('*')
      .eq('category_id', categoryId)
      .order('name');

    if (error) {
      console.error('Error fetching document types by category:', error);
      return [];
    }

    return data || [];

  } catch (error) {
    console.error('Error in fetchDocumentTypesByCategory:', error);
    return [];
  }
};
