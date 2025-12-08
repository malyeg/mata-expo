import { Item } from "@/api/itemsApi";
import { create } from "zustand";

interface AddItemState {
  // Add Item Modal
  isAddItemModalVisible: boolean;
  editItem: Item | null;
  openAddItemModal: () => void;
  openEditItemModal: (item: Item) => void;
  closeAddItemModal: () => void;
}

export const useAddItemStore = create<AddItemState>((set) => ({
  // Add Item Modal
  isAddItemModalVisible: false,
  editItem: null,
  openAddItemModal: () => set({ isAddItemModalVisible: true, editItem: null }),
  openEditItemModal: (item: Item) =>
    set({ isAddItemModalVisible: true, editItem: item }),
  closeAddItemModal: () =>
    set({ isAddItemModalVisible: false, editItem: null }),
}));
