const searchInput = document.querySelector('.search-box .search-bar input');
const searchIcon = document.querySelector('.search-bar .ri-search-line');
const searchBar = document.querySelector('.search-bar');

const categoryContainer = document.querySelector(".category-buttons");
const productContainer = document.querySelector(".product-list");
const filteredProducts = document.querySelector(".filtered-products");
filteredProducts.style.display = 'none';

// get unique categories
const categories = [...new Set(products.map(p => p.category))];

// add close button when search input is not empty
function checkInput() {
    const existingBtn = searchBar.querySelector('.ri-close-circle-line');

    if (searchInput.value.trim() !== '') {
        if (!existingBtn) {
            const i = document.createElement('i');
            i.classList.add('ri-close-circle-line');

            i.addEventListener('click', () => {
                searchInput.value = '';
                checkInput(); // Re-check input after clearing
                searchInput.focus();
            });

            searchBar.appendChild(i);
        }
    } else {
        if (existingBtn) {
            Parent.style.display = 'none';
            Parent.innerHTML = '';
            existingBtn.remove();
        }
    }
}

if(searchInput){
    // make search icon active when the search input is on focus
    searchInput.addEventListener('focus', () => {
        searchIcon.classList.add('active');
    });

    searchInput.addEventListener('input', checkInput); // check input while typing
    
    // remove active from search icon and check search input on focus change from the search bar
    searchInput.addEventListener('blur', () => {
        searchIcon.classList.remove('active');
        checkInput();
    });
}

const shownProductIds = new Set(); // Global tracker

// track products already shown
function trackProducts(productsArray){
    let available = products.filter(p => !shownProductIds.has(p.id));
    productsArray.forEach(p => shownProductIds.add(p.id));
}

// change content of a category section
function changeCategoryContent (category, containerID, append = null, count = 4){
    let top;

    if(category === 'random'){
        top = shuffleArray(products.filter(p => !shownProductIds.has(p.id))).slice(0, count);
    }else{ top = shuffleArray(products.filter(p => p.category.toLowerCase() === category.toLowerCase())).slice(0, count);}

    trackProducts(top);

    const container = document.getElementById(containerID);

    const message = top.map(product => `
                    <div class="product-card card" onclick="goTo('${product.category}', '${product.name}')">
                            <img src="Assets/car1.jpg" alt="">
                            <h4>${product.name}</h4>
                            <div class="card-info">
                                <p>Discover the latest electronic</p>
                                <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                            </div>
                            <h3><i class="ri-money-dollar-circle-fill"></i>${product.price}</h3>
                        </div>
                    `).join('');

    const loadContainer = document.createElement('div');
    loadContainer.className = 'card-container';
    loadContainer.innerHTML = message;
    if(append){
        container.appendChild(loadContainer);
    }else{
        container.innerHTML = message;
    }
}

// switch categories
function switchCategory(category, button, containerID){
    if(button){
    const group = button.closest('.category-selector'); // Get the group the button belongs to
    const buttons = group.querySelectorAll('button'); // Only buttons in that group

    buttons.forEach(btn => btn.classList.remove("active")); // Remove active class from all buttons in this group
    button.classList.add('active'); // Add active class to clicked button
    }

    // set container to switched category
    changeCategoryContent(category, containerID);
}

// Refresh category content on load
window.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vehicles'))
    changeCategoryContent('Cars', 'vehicles');

  if (document.getElementById('electronics'))
    changeCategoryContent('Printers', 'electronics');

  if (document.getElementById('recommended'))
    changeCategoryContent('random', 'recommended');

  if (document.getElementById('hot'))
    changeCategoryContent('random', 'hot');
});

let noMoreToLoad = false; // Global flag
const count = 4;

function loadMoreCategory({excluded = [], containerID = 'load-area'} = {}) {
    if (noMoreToLoad) return;

    // Get unused products
    const unused = products.filter(p => !shownProductIds.has(p.id));

    // If nothing left, exit
    if (unused.length === 0) {
        noMoreToLoad = true;
        return;
    }

    // Group unused products by category
    const categoryMap = {};
    unused.forEach(p => {
            if (!categoryMap[p.category]) categoryMap[p.category] = [];
            categoryMap[p.category].push(p);
        });

    // Turns thecategoryMap into an array of pairs    
    const valid = Object.entries(categoryMap).filter(([category, productsArray]) => {
                // filters only the categories that have at least 'count' number of products and the ones not contained in excluded array
                return productsArray.length >= count && !excluded.includes(category)}); 

    let selectedProducts = [];
    let selectedCategory = '';

    if (valid.length > 0) {
    // Pick random entry from valid categories
        const [cat, list] = valid[Math.floor(Math.random() * valid.length)];
        selectedCategory = cat;
        selectedProducts = shuffleArray(list).slice(0, count);
    } else {
        // Final load: grab whatever is left from any one category
        const [cat, list] = Object.entries(categoryMap)[0]; // pick any category
        selectedCategory = cat;
        selectedProducts = list; // maybe < count
        noMoreToLoad = true;
    }

    // Track them as shown
    trackProducts(selectedProducts);

    // Build and append section
    const cardsHTML = selectedProducts.map(p => `
                    <div class="product-card card" onclick="goTo('${p.category}', '${p.name}')">
                        <img src="Assets/car1.jpg" alt="">
                        <h4>${p.name}</h4>
                        <div class="card-info">
                        <p>Discover the latest in ${p.category}</p>
                        <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                        </div>
                        <h3><i class="ri-money-dollar-circle-fill"></i>${p.price}</h3>
                    </div>
                    `).join('');

    const labelText = document.createElement('div');
    labelText.className = 'sub-title';
    labelText.innerHTML = `
                    <h2>${selectedCategory}</h2>
                    <a href="./cart.html">See All</a>   
                    `;

    const cardContainer = document.createElement('div');
    cardContainer.className = 'card-container';
    cardContainer.innerHTML = cardsHTML;


    setTimeout(()=>{
        document.getElementById(containerID).appendChild(labelText);
        document.getElementById(containerID).appendChild(cardContainer);
    }, Math.floor(Math.random() * 100) + 1000);
    

    // Hide the button immediately if last load
    if (noMoreToLoad) {
        document.querySelector('.load-section').innerHTML = '<p>You\'ve Reached the End, <a href="./cart.html">Go to Cart</a></p>';
    }
}

const moreButton = document.querySelector('.load-more');
    
if (moreButton) {
    moreButton.addEventListener('click', () => {
        spinIcon(moreButton.querySelector('i'));
        loadMoreCategory({
        excluded: ['Cars', 'Buses', 'Bikes', 'Printers', 'Computers', 'Drones']
        });
    });
}

// spin icon on click
function spinIcon(element){
    element.classList.remove('spin');
    void element.offsetWidth; // force reflow to restart animation
    element.classList.add('spin');
}


let Parent = ''; // Tracks the parent container for rendering filtered products

// Filter products based on search input and render matching products
function searchAndRenderProducts(parent) {
    const query = searchInput.value.trim();

    if (!query) {
        parent.style.display = 'grid';
        parent.innerHTML = `<p style='display:flex; justify-content:center;'>Please enter a category to search.</p>`;
        setTimeout(() => {
            parent.style.display = 'none';
            parent.innerHTML = '';
        }, 500);
        searchInput.focus();
        return;
    }

    Parent = parent;
    filterByCategory(query, parent, null, 'filtered');
    parent.style.display = 'grid';
}

// Handles tab activation and scrolls to category if matched
function searchAndActivateTab(parent) {
    const query = searchInput.value.trim();
    if (!query) {
        parent.style.display = 'grid';
        parent.innerHTML = `<p style='display:flex; justify-content:center;'>Please enter a category to search.</p>`;
        setTimeout(() => {
            parent.style.display = 'none';
            parent.innerHTML = '';
        }, 500);
        searchInput.focus();
        return;
    }

    // Match category from list
    const matchedCategory = categories.find(cat => cat.toLowerCase() === query.toLowerCase());

    if (matchedCategory) {
        // Find corresponding button and trigger it
        const matchingBtn = Array.from(document.querySelectorAll('.category-btn')).find(btn => btn.textContent.toLowerCase() === matchedCategory.toLowerCase());

        if (matchingBtn) {
            matchingBtn.click();
            matchingBtn.scrollIntoView({ behavior: 'smooth', inline: 'center'});
        }
    } else {
        // Handle invalid category input
        const validCategories = [...new Set(products.map(p => p.category))];
        const suggestions = validCategories.join(', ');

        parent.style.display = 'grid';
        parent.innerHTML = `<p>Please enter a valid category. Try one of - ${suggestions}.</p>`;
        setTimeout(() => {
            parent.style.display = 'none';
            parent.innerHTML = '';
        }, 3000);
    }
}

// Trigger search functions when Enter key is pressed
searchInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        searchAndActivateTab(filteredProducts);
        searchAndRenderProducts(filteredProducts);
    }
});

// Randomly shuffle products for dynamic display
function shuffleArray(array) {
    return array
        .map(item => ({ item, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ item }) => item);
}

// Toggle active class on clicked category button
function setActiveButton(clickedButton) {
    const allButtons = document.querySelectorAll('.category-btn');
    allButtons.forEach(btn => btn.classList.remove('active'));
    clickedButton.classList.add('active');
}

// Create category buttons including "All" and others from the product list
function createCategoryButtons(){
    const allBtn = document.createElement('button');
    allBtn.textContent = 'All';
    allBtn.className = 'category-btn active';
    allBtn.onclick = function () {
        setActiveButton(this);
        productContainer.innerHTML = '';
        const shuffled = shuffleArray(products);
        renderCategoryBlock('All Products', shuffled, productContainer);
    };
    
    if(categoryContainer) categoryContainer.appendChild(allBtn);

    categories.forEach(category => {
        const btn = document.createElement('button');
        btn.textContent = category;
        btn.className = 'category-btn';
        btn.onclick = function () {
            setActiveButton(this);
            filterByCategory(category, productContainer, productContainer);
        };
        if(categoryContainer) categoryContainer.appendChild(btn);
    });
}

// Filter and render products based on selected category
function filterByCategory(selectedCategory, parent, otherParent, mode) {
    parent.innerHTML = '';

    const top = shuffleArray(
        products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    );

    if (top.length > 0) {
        const categoryLabel = top.length > 0 ? top[0].category : selectedCategory;
        renderCategoryBlock(mode === 'filtered'?`Search results for ${categoryLabel}`:categoryLabel, top, parent, mode); // Show selected category first
    } else {
        const validCategories = [...new Set(products.map(p => p.category))];
        const suggestions = validCategories.join(', ');

        parent.style.display = 'none';
        parent.innerHTML = `<p>Please enter a valid category. Try one of - ${suggestions}.</p>`;
        setTimeout(() => {
            parent.style.display = 'grid';
            parent.innerHTML = '';
        }, 2500);
    }

    // Show remaining products under "Other Products" section
    const rest = shuffleArray(
        products.filter(p => p.category.toLowerCase() !== selectedCategory.toLowerCase())
    );

    if (rest.length > 0 && otherParent) {
        renderCategoryBlock('Other Products', rest, otherParent);
    }
}

// Render a labeled block of products under a given heading
function renderCategoryBlock(labelText, items, parent, mode) {
    const block = document.createElement('div');
    block.className = 'category-block';

    const label = document.createElement('h2');
    label.textContent = labelText;
    block.appendChild(label);

    renderProduct(items, block, mode);
    if(parent) parent.appendChild(block);
}

// Render product cards inside a given container
function renderProduct(items, parent, mode = 'full') {
    const group = document.createElement('div');
    group.className = 'product-group';

    items.forEach(product => {
        const card = document.createElement('div');
      
        // load searched products and set to link to cart
        if(mode === 'filtered'){
            card.innerHTML =  `
                <div class='product-card card' onclick="goTo('${product.category}', '${product.name}')">
                <img src="${'/Assets/car1.jpg'}" alt="${product.name}" class="product-image" />
                <h4>${product.name}</h4>
                <div class="card-info">
                    <p>Discover the latest electronic</p>
                    <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                </div>
               
                <h3>₦${product.price.toLocaleString()}</h3>
                </div
            `;
        }
        
        // Load products in card.html and set 'Add to cart'
        if (mode !== 'filtered') {
            card.className = 'product-card card';
            card.innerHTML = `
                <img src="${'/Assets/car1.jpg'}" alt="${product.name}" class="product-image" />
                <h3>${product.name}</h3>
                <p>₦${product.price.toLocaleString()}</p>
            `;
        }

        group.appendChild(card);
    });

    if(parent) parent.appendChild(group);
}

// function to go to cart.html with selected category and product
function goTo(category, product) {
  const timestamp = Date.now(); // force unique URL
  const url = `./cart.html?category=${encodeURIComponent(category)}${product?`&product=${encodeURIComponent(product)}`:''}&t=${timestamp}`;
  window.location.href = url;
}

const categoryButtons = document.querySelectorAll('.category-btn');

// Initialize category buttons and show all products on load
createCategoryButtons();
const shuffledInitial = shuffleArray(products);
renderCategoryBlock('All Products', shuffledInitial, productContainer);

// to read url Query Parameters
const params = new URLSearchParams(window.location.search);
const selectedCategory = params.get('category');
const selectedProduct = params.get('product');

// if category exists, trigger that category’s filter
if (selectedCategory) {
    const matchingBtn = Array.from(document.querySelectorAll('.category-btn')).find(
        btn => btn.textContent.toLowerCase() === selectedCategory.toLowerCase()
    );

    if (matchingBtn) {
        matchingBtn.click(); // this triggers the product rendering
        matchingBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
    }
}

// Scroll to the spectific product after rendering
if (selectedProduct) {
    setTimeout(() => {
        const match = [...document.querySelectorAll('.product-card')].find(card =>
            card.querySelector('h3')?.textContent === selectedProduct
        );
        if (match) {
            match.scrollIntoView({ behavior: 'smooth', block: 'center' });
            match.classList.add('highlighted');
        }
    }, 100); // delay to ensure rendering is done
}
