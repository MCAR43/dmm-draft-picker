import { supabase } from '$lib/supabase';

export type DraftBoard = {
  id?: string;
  title: string;
  selections: string[] | null[];
  created_at?: string;
  user_id?: string;
};

// Save a draft board to Supabase - creates or updates based on user_id
export const saveDraftBoard = async (draftBoard: DraftBoard) => {
  // Check if user already has a board
  if (draftBoard.user_id) {
    const { data: existingBoard } = await supabase
      .from('draft_boards')
      .select('id')
      .eq('user_id', draftBoard.user_id)
      .maybeSingle();

    // If board exists, update it instead of creating a new one
    if (existingBoard) {
      return updateDraftBoard(existingBoard.id, draftBoard);
    }
  }
  
  // Otherwise create a new board
  const { data, error } = await supabase
    .from('draft_boards')
    .insert(draftBoard)
    .select();
  
  return { data, error };
};

// Update an existing draft board
export const updateDraftBoard = async (id: string, draftBoard: Partial<DraftBoard>) => {
  const { data, error } = await supabase
    .from('draft_boards')
    .update(draftBoard)
    .eq('id', id)
    .select();
  
  return { data, error };
};

// Get a draft board by ID
export const getDraftBoard = async (id: string) => {
  const { data, error } = await supabase
    .from('draft_boards')
    .select('*')
    .eq('id', id)
    .single();
  
  return { data, error };
};

// Get a draft board by user ID
export const getDraftBoardByUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('draft_boards')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

// Get all draft boards for a user (keeping for backward compatibility)
export const getUserDraftBoards = async (userId: string) => {
  const { data, error } = await supabase
    .from('draft_boards')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  return { data, error };
};

// Delete a draft board
export const deleteDraftBoard = async (id: string) => {
  const { error } = await supabase
    .from('draft_boards')
    .delete()
    .eq('id', id);
  
  return { error };
}; 

export const getDraftStats = async (not_id: string | null) => {
  const { data, error } = not_id 
    ? await supabase
        .from('draft_boards')
        .select('*')
        .or(`user_id.neq.${not_id},user_id.is.null`)
    : await supabase
        .from('draft_boards')
        .select('*');

  return { data, error };
};
