import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { Models } from "react-native-appwrite";

const useAppwrite = (
  fn: () => Promise<Models.Document[] | Models.Document>,
) => {
  const [data, setData] = useState<Models.Document[] | Models.Document>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    await fn()
      .then((res) => {
        setData(res);
      })
      .catch((err) => {
        Alert.alert("Error", err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refetch = async () => {
    await fetchData();
  };
  return { data, loading, refetch };
};

export default useAppwrite;
