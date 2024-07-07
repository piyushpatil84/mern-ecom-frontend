import NavBar from "../features/navbar/Navbar";
import ProductDetail from "../features/product/components/ProductDetail";
function ProductDetailPage() {
    return (
        <>
            <NavBar>
                <ProductDetail />
            </NavBar>
        </>
    );
}

export default ProductDetailPage;