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

// set html of a product card for a container
function setCardHtml(container){
    return container.map(p => `
            <div class="product-card card" onclick="goTo('${p.category}', '${p.name}')">
                <img src="Assets/car1.jpg" alt="">
                <h4>${p.name}</h4>
                <div class="card-info">
                <p>Discover the latest in ${p.category}</p>
                <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                </div>
                <h3><i class="currency-icon fa fa-naira-sign"></i>${p.price.toLocaleString()}</h3>
            </div>
            `).join('');
}

const shownProductIds = new Set(); // Global tracker

// track products already shown
function trackProducts(productsArray){
    let available = products.filter(p => !shownProductIds.has(p.id));
    productsArray.forEach(p => shownProductIds.add(p.id));
}

const shownProductIdsBySection = {} // stores the ids of products already rendered in each category section

// change content of a category section
function changeCategoryContent (category, containerID, append = null, count = 4){
    let selectedProducts = [];

    if(shownProductIdsBySection[containerID]){
        // use cached IDs to get original products in same order
        const ids = shownProductIdsBySection[containerID];
        selectedProducts = ids
            .map(id => products.find(p => p.id === id)) // find the products already shown
            .filter(Boolean); // In case a product no longer exists
    }else {
        // first time rendering — filter/shuffle normally
        filtered = category === 'random'
            ? shuffleArray(products.filter(p => !shownProductIds.has(p.id))) // randomly take products not shown before
            : products.filter(p => p.category.toLowerCase() === category.toLowerCase()); // take products from a specific category
        
        selectedProducts = filtered.slice(0, count); // take only needed count
        trackProducts(selectedProducts); // track shown products

        // cache the ids of products used in this section
        shownProductIdsBySection[containerID] = selectedProducts.map(p => p.id);
    }
    
    const container = document.getElementById(containerID);
    const message = setCardHtml(selectedProducts);

    const loadContainer = document.createElement('div');
    loadContainer.className = 'card-container';
    loadContainer.innerHTML = message;
    if(append){
        container.appendChild(loadContainer);
    }else{
        container.innerHTML = message;
    }
}

// will use the cached IDs to refresh content(used after changing currency)
function updateCategoryContent(){
    for (const containerId in shownProductIdsBySection) {
        changeCategoryContent('cached', containerId);
    }
    refreshMoreSections();
    refreshCategoryBlock('All Products', shuffledInitial, productContainer);
    refreshFilteredCategory();
}

function switchCategory(category, button, containerID){
    if(button){
    const group = button.closest('.category-selector'); // Get the group the button belongs to
    const buttons = group.querySelectorAll('button'); // Only buttons in that group

    buttons.forEach(btn => btn.classList.remove("active")); // Remove active class from all buttons in this group
    button.classList.add('active'); // Add active class to clicked button
    }

    // delete cache of products for the container 
    delete shownProductIdsBySection[containerID]
    // set container to switched category
    changeCategoryContent(category, containerID);
}

window.addEventListener('DOMContentLoaded', async () => {
    // Refresh contents on load
    if (document.getElementById('vehicles'))
        changeCategoryContent('Cars', 'vehicles');

    if (document.getElementById('electronics'))
        changeCategoryContent('Printers', 'electronics');

    if (document.getElementById('recommended'))
        changeCategoryContent('random', 'recommended');

    if (document.getElementById('hot'))
        changeCategoryContent('random', 'hot');
    // updateCurrencyIcons('NGN');

    // fetchRates from API
    await fetchRates();
});

let moreSections = []; // Stores each loaded section
// used to rebuild loaded products with updated prices
function refreshMoreSections() {
    const container = document.getElementById('load-area');
    if(container) container.innerHTML = ''; // clear all previously rendered more sections

    moreSections.forEach(({ category, productIds }) => {
        const productsToShow = productIds
          .map(id => products.find(p => p.id === id))
          .filter(Boolean);

        const cardsHTML = setCardHtml(productsToShow);

        const labelText = document.createElement('div');
        labelText.className = 'sub-title';
        labelText.innerHTML = `
          <h2>${category}</h2>
          <a href="./cart.html">See All</a>   
        `;

        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.innerHTML = cardsHTML;

        container.appendChild(labelText);
        container.appendChild(cardContainer);
    });
}

let noMoreToLoad = false; // Global flag
// load more categories on homepage
function loadMoreCategory({excluded = [], containerID = 'load-area', count = 4} = {}) {
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

    // save this loaded section for future refresh
    moreSections.push({
        category: selectedCategory,
        productIds: selectedProducts.map(p => p.id)
    });

    // Build and append section
    const cardsHTML = setCardHtml(selectedProducts)

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

let lastFilter = {
    category: null,
    parent: null,
    otherParent: null,
    mode: 'filtered'
}; // to track the last searched results

// Filter and render products based on selected category
function filterByCategory(selectedCategory, parent, otherParent, mode) {
    // Store the last filter state
    lastFilter = {
        category: selectedCategory,
        parent: parent,
        otherParent: otherParent,
        mode: mode
    };
    
    parent.innerHTML = '';

    const top = shuffleArray(
        products.filter(p => p.category.toLowerCase() === selectedCategory.toLowerCase())
    );

    if (top.length > 0) {
        const categoryLabel = top.length > 0 ? top[0].category : selectedCategory;
        renderCategoryBlock(mode === 'filtered'?`Search results for ${categoryLabel}`:categoryLabel, top, parent, mode); // Show selected category first
    } else {
        const validCategories = [...new Set(products.map(p => p.category))];// creates a new array for just the selected categories
        const suggestions = validCategories.join(', ');

        parent.innerHTML = `<p>Please enter a valid category. Try one of - ${suggestions}.</p>`;
        setTimeout(() => {
            parent.style.display = 'none';
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

function refreshFilteredCategory() {
    const { category, parent, otherParent, mode } = lastFilter;
    if (category && parent) {
        filterByCategory(category, parent, otherParent, mode);
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
        card.className = 'product-card card';

        if (mode === 'filtered') {
            card.setAttribute('onclick', `goTo('${product.category}', '${product.name}')`);
            card.innerHTML = `
                <img src="/Assets/car1.jpg" alt="${product.name}" class="product-image" />
                <h4>${product.name}</h4>
                <div class="card-info">
                    <p>Discover the latest electronic</p>
                    <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                </div>
                <h3><i class="currency-icon fa fa-naira-sign"></i>${product.price.toLocaleString()}</h3>
            `;
        } else {
            card.innerHTML = `
                <img src="/Assets/car1.jpg" alt="${product.name}" class="product-image" />
                <h3>${product.name}</h3>
                <p><i class="currency-icon fa fa-naira-sign"></i>${product.price.toLocaleString()}</p>
            `;
        }

        group.appendChild(card);
    });

    if (parent) parent.appendChild(group);
}

// Re-render with updated prices
function refreshRenderedProducts(items, parent, mode = 'full') {
    if (parent) parent.innerHTML = '';
    renderProduct(items, parent, mode); 
}
function refreshCategoryBlock(labelText, items, parent, mode) {
    // Remove all existing children
    if (parent) parent.innerHTML = '';

    // Re-render updated block with new currency values
    renderCategoryBlock(labelText, items, parent, mode);
}


// function to go to cart.html with selected category and product
function goTo(category, product) {
  const timestamp = Date.now(); // force unique URL
  const url = `./cart.html?category=${encodeURIComponent(category)}${product?`&product=${encodeURIComponent(product)}`:''}&t=${timestamp}`;
  window.location.href = url;
}

// Initialize category buttons and show all products on load
createCategoryButtons();
const shuffledInitial = shuffleArray(products);// just got used to shuffling at this point
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


const Select = document.querySelector('.select-container');
const trigger = Select.querySelector('.select-trigger');
const option = Select.querySelectorAll('.option');
const options = Select.querySelector('.options');
const arrow = Select.querySelector('.ri-arrow-down-s-line');

let isRotated = false;
Select.addEventListener('click', (e) => {
    // Only toggle if clicking on the trigger (not on options)
    const isOption = options.contains(e.target);

    if (!isOption) {
        Select.classList.toggle('open');
        isRotated = !isRotated;
        arrow.style.transform = isRotated ? 'rotate(180deg)' : 'rotate(0deg)';
    }
});

function selectCurrency(opt) {
    const value = opt.dataset.value;
    const label = opt.innerHTML;

    // Update visible selected value
    trigger.querySelector('span').innerHTML = label;

    // Close dropdown
    Select.classList.remove('open');

    // Reset arrow rotation
    isRotated = false;
    arrow.style.transform = 'rotate(0deg)';

    // Trigger currency logic
    handleCurrencyChange(value);
}

option.forEach(opt => {
    opt.addEventListener('click', () => {
        // trigger currency change handler 
        selectCurrency(opt);
        
        // remove selcected class from all
        option.forEach(opt => opt.classList.remove('selected'));

        // add selected class to current
        opt.classList.add('selected');
    });
});

// Add highlight to current option
function highlightOption(index) {
    // Remove any previous highlight
    option.forEach(option => option.classList.remove('highlighted'));

   
    if (option[index]) {
    option[index].classList.add('highlighted');
    }
}

let focusedIndex = -1; // Keeps track of which option is focused

// keyboard event for when select container is selected
Select.addEventListener('keydown', (e) => {
    const isOpen = Select.classList.contains('open');

    if ((e.key === 'Enter' || e.key === ' ') && focusedIndex === -1) {
        e.preventDefault();
        Select.classList.toggle('open');
        return;
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();

        if (!isOpen) {
            Select.classList.add('open');
        }

        focusedIndex = (focusedIndex + 1) % option.length;
        highlightOption(focusedIndex);
    }

    else if (e.key === 'ArrowUp') {
        e.preventDefault();

        if (!isOpen) {
            Select.classList.add('open');
        }

        focusedIndex = (focusedIndex - 1 + option.length) % option.length;
        highlightOption(focusedIndex);
    }

    // Select with Enter or Space if option is highlighted
    else if ((e.key === 'Enter' || e.key === ' ') && isOpen && focusedIndex !== -1) {
        e.preventDefault();
        option[focusedIndex].click();
        focusedIndex = -1;
    }
});

// Close dropdown if focus is outside
Select.addEventListener('blur', () => {
    Select.classList.remove('open');
    isRotated = false;
    Select.querySelector('.ri-arrow-down-s-line').style.transform = 'rotate(0deg)';
});

let conversionRates = {};

// get rates from api
async function fetchRates() {
    try {
        const res = await fetch(`https://v6.exchangerate-api.com/v6/ff0d7bb9188a0511930076eb/latest/NGN`);
        const data = await res.json();
        conversionRates = data.conversion_rates;
        saveRatesToStorage(conversionRates);
    } catch (err) {
        console.error('Failed to fetch rates', err.message);
    }
}

// save rates to local storage
function saveRatesToStorage(rates) {
    localStorage.setItem('exchangeRates', JSON.stringify(rates));
    localStorage.setItem('ratesTimestamp', Date.now());
}

// get rates from local storage
function getRatesFromStorage() {
    const raw = localStorage.getItem('exchangeRates');
    return raw ? JSON.parse(raw) : null;    
}

// convert based on rate from storage
function convertPrice(basePrice, targetCurrency){
    targetCurrency = targetCurrency.toUpperCase();
    
    const rates = getRatesFromStorage();
    const ngnRate = rates['NGN'];
    const targetRate = rates[targetCurrency];

    if (!ngnRate || !targetRate) return basePrice;

    // Step 1: base price -> NGN
    const changedPrice = basePrice / ngnRate;

    // Step 2: changed price in NGN -> Target Currency
    const convertedPrice = +(changedPrice * targetRate).toFixed(2);
    

    return convertedPrice;
}

function updateCurrencyIcons(currency) {
    currency = currency.toLowerCase();

    const Icons = {
        usd: 'fa-dollar-sign',
        eur: 'fa-euro-sign',
        ngn: 'fa-naira-sign',
        gbp: 'fa-pound-sign'
    };

    const iconClass = Icons[currency] || 'fa-naira-sign';

    document.querySelectorAll('.currency-icon').forEach(icon => {
        icon.className = `currency-icon fa ${iconClass}`;
    });
}

function handleCurrencyChange(selectedCurrency){
    if (selectedCurrency === 'NGN') {
        products.forEach(p => p.price = p.originalPrice);
    } else {
        products.forEach(p => {
            if (!p.originalPrice) p.originalPrice = p.price;
            p.price = convertPrice(p.originalPrice, selectedCurrency);
        });
    }
    updateCategoryContent(); // rebuild all visible sections
    updateCurrencyIcons(selectedCurrency);
}
