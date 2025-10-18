import useLocationStore from "@/store/location-store";

const useLocation = () => {
  const store = useLocationStore();

  return store;
};

export default useLocation;
