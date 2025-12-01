import { create } from "zustand";

interface AddItemState {
  // Add Item Modal
  isAddItemModalVisible: boolean;
  openAddItemModal: () => void;
  closeAddItemModal: () => void;
}

export const useAddItemStore = create<AddItemState>((set) => ({
  // Add Item Modal
  isAddItemModalVisible: false,
  openAddItemModal: () => set({ isAddItemModalVisible: true }),
  closeAddItemModal: () => set({ isAddItemModalVisible: false }),
}));
