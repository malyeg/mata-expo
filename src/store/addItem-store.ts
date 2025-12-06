import { create } from "zustand";

interface AddItemState {
  // Add Item Modal
  isAddItemModalVisible: boolean;
  editItemId: string | null;
  openAddItemModal: () => void;
  openEditItemModal: (itemId: string) => void;
  closeAddItemModal: () => void;
}

export const useAddItemStore = create<AddItemState>((set) => ({
  // Add Item Modal
  isAddItemModalVisible: false,
  editItemId: null,
  openAddItemModal: () => set({ isAddItemModalVisible: true, editItemId: null }),
  openEditItemModal: (itemId: string) =>
    set({ isAddItemModalVisible: true, editItemId: itemId }),
  closeAddItemModal: () => set({ isAddItemModalVisible: false, editItemId: null }),
}));
