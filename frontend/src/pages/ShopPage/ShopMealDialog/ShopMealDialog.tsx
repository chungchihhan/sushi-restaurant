import { useParams } from "react-router-dom";

type ShopListData = {
  id: string;
  img: string;
  title: string;
  star: string;
  price: string;
  category: string;
  foodtype: string;
  // description: string;
};

type ShopListPageProps = {
  category: string;
};

export default function ShopMealDialog() {
  const { id, mealid } = useParams();
  console.log(id, mealid);

  return (
    <div className="blue-square-container">
      沃草！
      {id}
    </div>
  );
}
