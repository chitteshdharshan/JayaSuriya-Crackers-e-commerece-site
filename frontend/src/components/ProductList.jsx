function ProductList({ products }) {
  return (
    <div>
      <h2>Products</h2>

      {products.map((p) => (
        <div key={p._id} style={{ border: "1px solid gray", margin: "10px" }}>
          <h3>{p.name}</h3>
          <p>₹{p.price}</p>
          <p>{p.category}</p>
          {p.image && <img src={p.image} width="100" />}
        </div>
      ))}
    </div>
  );
}

export default ProductList;