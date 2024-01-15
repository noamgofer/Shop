//creating gallery elements
const productContainer = document.getElementById("productContainer");
const appendProduct = (product) =>{
    let div = document.createElement("div");
    div.setAttribute("class","flexContainer productDiv");

    let img = document.createElement("img");
    img.setAttribute("class","productImage");
    img.setAttribute("src",product.imageUrl);
    img.setAttribute("alt","img");

    let textDiv = document.createElement("div");
    textDiv.setAttribute("class","flexContainer productTextContainer");

    let title = document.createElement("p");
    title.setAttribute("class","productText productTitle");
    title.innerHTML = product.name;

    let description = document.createElement("p");
    description.setAttribute("class","productText productDescription");
    description.innerHTML = product.description;

    let price = document.createElement("p");
    price.setAttribute("class","productText productPrice");
    price.innerHTML = product.price + "$";

    let button = document.createElement("button");
    button.setAttribute("class","addToCart");
    button.innerHTML = "Add to cart";
    
    let i = document.createElement("i");
    i.setAttribute("class","fa-solid fa-cart-shopping")

    button.append(i);
    textDiv.append(title,description,price);
    div.append(img,textDiv,button);
    productContainer.append(div);
    button.addEventListener("click",()=>{
        appendProductToCart(product)
    })
}
//creating cart elements
const cartProductContainer = document.getElementById("cartProductContainer");
let cartArr = [];
const appendProductToCart = (product) =>{
    product.trashClicked = false; //trashClicked for detecting "trash" click
    cartArr.push(product);
    let div = document.createElement("div");
    div.setAttribute("class","flexContainer cartProductDiv");
    
    let img = document.createElement("img");
    img.setAttribute("class","cartProductImage");
    img.setAttribute("src",product.imageUrl);
    img.setAttribute("alt","img");
    
    let title = document.createElement("p");
    title.setAttribute("class","productText cartProductTitle");
    title.innerHTML = product.name;
    
    let price = document.createElement("p");
    price.setAttribute("class","productText cartProductPrice");
    price.innerHTML = product.price + "$";
    let button = document.createElement("button");
    let i = document.createElement("i");
    i.setAttribute("class","fa-solid fa-trash")
    
    button.append(i)
    div.append(img,title,price,button);

    cartProductContainer.append(div);
    button.addEventListener("click",()=>{ //event listener for trash icon
        cartProductContainer.removeChild(button.parentElement)
        calculateCart(-product.price)
        product.trashClicked = true; 
        removeProductFromCartArr()
    })
    calculateCart(product.price)
}
//remove flagged trash
const removeProductFromCartArr = () =>{
    cartArr.forEach((element,index)=>{
        if(element.trashClicked==true){cartArr.splice(index,1)}
    })
}
//cart elements
const footerTotal = document.getElementById("footerTotal");
const footerOrderTotal = document.getElementById("footerOrderTotal");
//checkoutElements
const checkoutTotal =document.getElementById("checkoutTotal");
const checkoutOrderTotal = document.getElementById("checkoutOrderTotal");
//initial price
let currentOrderPrice = 0;
const calculateCart = (price) =>{
    //handling cart footer
    currentOrderPrice += price;
    footerTotal.innerHTML = `Total: ${currentOrderPrice}$`
    footerOrderTotal.innerHTML = `Order total: ${currentOrderPrice+5}$`
    //handling checkout
    checkoutTotal.innerHTML = `Your order cost: ${currentOrderPrice}$`;
    checkoutOrderTotal.innerHTML = `Cost with shipping & fees: ${currentOrderPrice+5}$`
}
//products arr from database
let productArr = [];
//user element for injection
const userElement = document.querySelector("#headerUser")
//store session user
let currentUserName = "";
//load products from database
const loadProducts= () =>{
    fetch("/loadProducts",{
        method: "get",
        headers: {"Content-Type":"application/json"},
    })
    .then(res=>res.json())
    .then(data=>{
        productArr = data[0]; //all database products
        currentUserName = data[1]; //logged in user
        userElement.innerHTML = `Welcome, ${currentUserName}`;
        productArr.forEach(product => {appendProduct(product)});
    })
}
//sign out
const signOut=()=>{ window.location.href="http://localhost:3000"}
//load products on page load
document.addEventListener('DOMContentLoaded', ()=> {loadProducts()});
//sort product arr
const sortProducts = (sortType) => {
    if(sortType == "name"){
        productArr.sort((a,b)=>{
            let fa = a.name.toLowerCase();
            let fb = b.name.toLowerCase();
            if (fa < fb) {return -1}
            if (fa > fb) {return 1}
            return 0;
        })
    }
    if(sortType == "priceLTH"){productArr.sort((a,b)=>{return a.price-b.price})}
    if(sortType == "priceHTL"){productArr.sort((a,b)=>{return b.price-a.price})}
    //removing all products
    while (productContainer.firstChild) {productContainer.removeChild(productContainer.firstChild)}
    //append sorted products
    productArr.forEach(product => {appendProduct(product)});
}
//search input element
const searchInput = document.querySelector("#galleryHeaderSearchInput");
//searching product arr
searchInput.addEventListener("input",()=>{
    let searchStr = searchInput.value;
    //case insensitive search
    let searchedArr = productArr.filter(product=>product.name.toLowerCase().includes(searchStr.toLowerCase()));
    //removing all products
    while (productContainer.firstChild) {productContainer.removeChild(productContainer.firstChild)}
    //append sorted products
    searchedArr.forEach(product => {appendProduct(product)});
})
//listening and calling product sorting
const galleryHeaderSortButton = document.getElementById("galleryHeaderSortButton");
galleryHeaderSortButton.addEventListener("click",()=>{
    currentSortType = galleryHeaderSortButton.dataset.sorttype;
    if(currentSortType == "name"){
        galleryHeaderSortButton.dataset.sorttype = "priceLTH";
        galleryHeaderSortButton.innerHTML = "Price: low to high"
        sortProducts("priceLTH")
    }
    if(currentSortType == "priceLTH"){
        galleryHeaderSortButton.dataset.sorttype = "priceHTL";
        galleryHeaderSortButton.innerHTML = "Price: high to low"
        sortProducts("priceHTL")
    }
    if(currentSortType == "priceHTL"){
        galleryHeaderSortButton.dataset.sorttype = "name";
        galleryHeaderSortButton.innerHTML = "Name"
        sortProducts("name")
    }
})
//handling open/close animations for checkout
const mainContainer = document.querySelector("container");
const checkoutContainer = document.getElementById("checkoutContainer");
// checkoutContainer.style.visibility = "hidden";
const openCheckout = () =>{
    if(cartProductContainer.childNodes.length > 1){
        checkoutContainer.classList.remove("closeCheckout");
        checkoutContainer.classList.add("openCheckout");
        checkoutContainer.style.visibility = "visible";
        //blur and disable background
        mainContainer.style.filter = "blur(5px)"
        mainContainer.style.opacity = "0.5"
        mainContainer.style.pointerEvents = "none"
    }
    else{alert("Your cart is empty!")}
}
const closeCheckout = () =>{
    checkoutContainer.classList.remove("openCheckout");
    checkoutContainer.classList.add("closeCheckout");
    setTimeout(()=>{checkoutContainer.style.visibility = "hidden";},150)
    //unblur and enable background
    mainContainer.style.filter = "blur(0px)";
    mainContainer.style.opacity = "1"
    mainContainer.style.pointerEvents = "auto";
}
//checking card data and sending to sever
const cardNumber = document.getElementById("cardNumber");
const expiryDate = document.getElementById("expiryDate");
const cvv = document.getElementById("cvv");
const checkAndSend = () =>{
    if(cardNumber.value.length!=12 || expiryDate.value.length!=5 || expiryDate.value.charAt(2)!="/" || cvv.value.length !=3){
        alert("Please enter card details correctly");
        return false;
    }
    else{
        let idArray = cartArr.map(product=>product.id) //map product IDs to array
        fetch("/submitOrder",{
            method:"post",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({idArray,currentUserName})
        })
        .then((res)=>res.json())
        .then((data)=>{
            if (data.message == "ok"){
                window.location.href ="http://localhost:3000";
            }else(console.log("error"))
        })
    }
}
