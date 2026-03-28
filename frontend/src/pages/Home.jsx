import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";

function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5001/products")
      .then(res => res.json())
      .then(data => setProducts(data));
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Welcome to Jayasuriya Crackers 🎆
      </h1>

      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        marginTop: "20px"
      }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}

export default Home;