import React, { Component } from 'react';
import ProductList from '../ProductList'
import AddProduct from '../AddProduct';
import ProductInformation from '../ProductInformation';
import EditProduct from '../EditProduct';


class ProductContainer extends Component {
  constructor() {
    super();
    this.state = {
      products: [],
      showAddWindow: false,
      showProductInformation: false,
      productId: '',
      editedProduct: '',
      showEditProduct: false
     }
  }

  componentDidMount() {
    this.setState({
      products: []
    })
    this.getProducts();
  }

  getProducts = async () => {
    // https://developer.mozilla.org/en-US/docs/Web/API/Response
    const responseObject = await fetch('http://localhost:9292/product', {
      credentials: 'include'
    });
    console.log(responseObject)

    const parsedResponsePromise = await responseObject.json();
    console.log(parsedResponsePromise);
    this.setState({ products: parsedResponsePromise.products })
    console.log(this.state)
  }

  showAddProduct = () => {
    this.setState({showAddWindow: true});
  }
  hideAddProduct = () => {
    this.setState({showAddWindow: false});
  }

  addNewProduct = async (product) => {

    const productsJson = await fetch('http://localhost:9292/product', {
      credentials: 'include',
      method: 'POST',
      body: JSON.stringify(product)
    });
    const productsParsed = await productsJson.json();
    console.log(productsParsed);
    this.setState({
      products: [...this.state.products, productsParsed.new_product]
    })
  }

  showProductInformation = (e) => {
    // grabs id from the div containing the product we clicked on
    const id = e.currentTarget.parentNode.parentNode.id;

    // show product info window
    // add productId to state so that ProductInformation will know what product it's showing info for
    this.setState({
      showProductInformation: true,
      productId: id
    });
  }

  hideProductInformation = () => {
    this.setState({showProductInformation: false});
  }

  // show the product editing modal
  showEditProduct = () => {
    this.setState({
      showEditProduct: true
    })
  }

  hideEditProduct = () => {
    this.setState({showEditProduct: false})
  }

  //editProduct --
  editedProduct = (e) => {
    console.log(e.currentTarget)
    const id = e.currentTarget.previousSibling.id;
    console.log(id)
    this.setState({
      editedProduct: this.state.editedProduct[id]
    })
  }

  render() {
    // console.log(this.props, 'this is the products list in product container');
    return (
      <div>
        <h1>This is the product list</h1>
        <ProductList products={this.state.products} showAddProduct={this.showAddProduct} showProductInformation={this.showProductInformation}/>

        { this.state.showProductInformation ? <ProductInformation products={this.state.products} hideProductInformation={this.hideProductInformation} productId={this.state.productId} showEditProduct={this.showEditProduct} /> : null }

        { this.state.showAddWindow ? <AddProduct addNewProduct={this.addNewProduct} hideAddProduct={this.hideAddProduct}/> : null }
        { this.state.showEditProduct ? <EditProduct products={this.state.products} productId={this.state.productId} hideEditProduct={this.hideEditProduct} editedProduct={this.editedProduct} /> : null }


      </div>
    )
  }

}

export default ProductContainer;
