import { Route, Switch, useRouteMatch } from "react-router-dom";
import ChosenProduct from "./ChosenProduct";
import Products from "./Products";
import "../../../css/products.css";
import { CartItem } from "../../../lib/types/search";

interface ProductPageProps {
  onAdd: (item: CartItem) => void;
}

export default function ProductsPage({ onAdd }: ProductPageProps) {
  const { path } = useRouteMatch();

  return (
    <div className="products-page">
      <Switch>
        <Route exact path={path}>
          <Products onAdd={onAdd} />
        </Route>

        <Route path={`${path}/:productId`}>
          <ChosenProduct onAdd={onAdd} />
        </Route>
      </Switch>
    </div>
  );
}
