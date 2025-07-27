const searchInput = document.getElementById('searchInput');
const searchIcon = document.querySelector('.search-bar .ri-search-line');
const searchBar = document.querySelector('.search-bar');

const categoryContainer = document.querySelector(".category-buttons");
const productContainer = document.querySelector(".product-list");
const filteredProducts = document.querySelector(".filtered-products");
filteredProducts.style.display = 'none';

let cart = []; // to track products added to cart
loadCartFromStorage(); // load cart from local storage first

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
                searchIcon.classList.add('active');
                // Clear filtered results when search is cleared
                filteredProducts.style.display = 'none';
            });

            searchBar.appendChild(i);
        }
    } else {
        box.style.display = 'none'; // hide suggestion box when input is empty
        if (existingBtn) {
            existingBtn.remove();
        }
    }
}

const searchBtn = document.querySelector('.search-btn');
const box = document.getElementById('suggestionBox');

// make search icon active when the search input is on focus
searchInput.addEventListener('focus', () => {
    searchIcon.classList.add('active');
});

// Utility function to get search matches with cart priority
function getSearchMatches(query) {
    const nameMatches = products.filter(p => p.name.toLowerCase().includes(query));
    const categoryMatches = products.filter(p => p.category.toLowerCase().includes(query));

    // Prioritize cart items in suggestions
    const cartProductIds = cart.map(item => item.id);
    const cartNames = nameMatches.filter(p => cartProductIds.includes(p.id)).map(p => p.name);
    const nonCartNames = nameMatches.filter(p => !cartProductIds.includes(p.id)).map(p => p.name);
    
    const names = [...cartNames, ...nonCartNames];
    const categories = categoryMatches.map(p => p.category);
    return {
        names,
        categories,
        all: [...new Set([...categories, ...names])].slice(0, 5)
    };
}

// Display suggestions or 'no results' message
function handleSearch() {
    checkInput();
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        searchInput.classList.add('shake');
        setTimeout(() => searchInput.classList.remove('shake'), 400);
        return;
    }

    const matches = getSearchMatches(query).all;

    if (matches.length === 0) {
        box.innerHTML = '';
        box.style.display = 'none';
        return;
    }

    // Render suggestions with cart indicators
    box.innerHTML = '';
    matches.forEach(match => {
        const div = document.createElement('div');
        
        // Check if this suggestion corresponds to a cart item
        const isProductInCart = products.some(p => 
            (p.name === match || p.category === match) && 
            cart.some(cartItem => cartItem.id === p.id)
        );
        
        div.innerHTML = `${match} ${isProductInCart ? '<span class="cart-badge-small">In Cart</span>' : ''}`;
        div.classList.add('suggestion-item');
        if (isProductInCart) div.classList.add('in-cart-suggestion');
        
        div.addEventListener('click', () => {
            searchInput.value = match;
            box.style.display = 'none';
            filterByCategory(match, filteredProducts, null, 'filtered');
            filteredProducts.style.display = 'grid';
        });
        box.appendChild(div);
    });
    box.style.display = 'block';
}

// Handle input changes
searchInput.addEventListener('input', handleSearch);

// Handle keyboard nav
let selectedIndex = -1;
searchInput.addEventListener('keydown', (e) => {
    const items = box.querySelectorAll('.suggestion-item');

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (box.style.display === 'block') {
            selectedIndex = (selectedIndex + 1) % items.length;
            updateHighlight(items);
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (box.style.display === 'block') {
            selectedIndex = (selectedIndex - 1 + items.length) % items.length;
            updateHighlight(items);
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        box.innerHTML = '';
        box.style.display = 'none';
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].click();
        } else {
            performSearch();
        }
    } else if (e.key === 'Escape') {
        box.style.display = 'none';
        selectedIndex = -1;
    }
});

// highlight suggestions for keyboard navigation
function updateHighlight(items) {
    items.forEach(item => item.classList.remove('active'));
    if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].classList.add('active');
    }
}

searchInput.addEventListener('blur', () => {
    searchIcon.classList.remove('active');
    setTimeout(() => {
        box.style.display = 'none';
        checkInput();
    }, 400);
});

// set placeholder message for invalid or empty search input
function setTemporaryPlaceholder(msg, inputContainer = searchInput) {
    const original = searchInput.getAttribute('data-original') || inputContainer.placeholder;

    if (!inputContainer.getAttribute('data-original')) {
        inputContainer.setAttribute('data-original', original);
    }

    inputContainer.placeholder = msg;
    inputContainer.classList.add('shake');
    setTimeout(() => inputContainer.classList.remove('shake'), 400);
    inputContainer.value = '';

    setTimeout(() => {
        inputContainer.placeholder = searchInput.getAttribute('data-original');
    }, 2500);
}

// Perform actual product search & filtering
function performSearch() {
    const query = searchInput.value.trim().toLowerCase();

    // Handle empty search input
    if (!query) {
        setTemporaryPlaceholder(`Please type something...`);
        return;
    }

    const { categories, names } = getSearchMatches(query);

    if (categories.length > 0) {
        filterByCategory(query, filteredProducts, null, 'filtered');
        filteredProducts.style.display = 'grid';
        if(query === categories[0].toLowerCase()){
            const matchingBtn = Array.from(document.querySelectorAll('.category-btn')).find(btn => btn.textContent.toLowerCase() === query);

            if (matchingBtn) {
                matchingBtn.click();
                matchingBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                // Hide filtered results when clicking category button
                filteredProducts.style.display = 'none';
            }
        }
    } else if (names.length > 0) {
        filterByCategory(query, filteredProducts, null, 'filtered');
        filteredProducts.style.display = 'grid';
    } else {
        setTemporaryPlaceholder(`No results for "${query}"`);
        filteredProducts.style.display = 'none';
    }
}

// Trigger search
searchBtn.addEventListener('click', performSearch);

// Add event listener to hide filtered results when category buttons are clicked 
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('category-btn')) {
        filteredProducts.style.display = 'none';
        searchInput.value = '';
        checkInput();
    }
});

// set html of a product card for a container
function setCardHtml(container){
    return container.map(p => `
            <div class="product-card card" data-id="${p.id}" onclick="goTo('${p.category}', '${p.id}')">
                <img src="./Assets/car1.jpg" alt="${p.name}" class="product-image" />
                <h4>${p.name}</h4>
                <div class="card-info">
                <p>Discover the latest in ${p.category}</p>
                <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                </div>
                <h3 class="product-price"><i class="currency-icon"></i>${p.price.toLocaleString()}</h3>
            </div>
            `).join('');
}

const shownProductIds = new Set(); // Global tracker

// track products already shown
function trackProducts(productsArray){
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
    updateCurrencyIcons();
}

let currentCurrency = localStorage.getItem('currency') || 'NGN';

// handle custom select dropdowns
document.querySelectorAll('.select-container').forEach((Select) => {
    const options = Select.querySelector('.options');
    const trigger = Select.querySelector('.select-trigger');
    const arrow = Select.querySelector('.ri-arrow-down-s-line');
    const allOptions = Select.querySelectorAll('.option');
    let focusedIndex = -1;
    let isRotated = false;

    const isCurrencySelector = Select.dataset.type === 'currency';
    const span = trigger.querySelector('span');

    // Currency selector default value from localStorage
    if (isCurrencySelector) {
        const selectedOption = Array.from(allOptions).find(opt =>
            opt.dataset.value?.toLowerCase() === currentCurrency.toLowerCase()
        );
        if (selectedOption) {
            allOptions.forEach(opt => opt.classList.remove('selected'));
            selectedOption.classList.add('selected');
            const icon = selectedOption.querySelector('i').className;
            const text = selectedOption.textContent.trim();
            span.innerHTML = `<i class="${icon}"></i>${text}`;
        }
    }

    // Highlight logic
    function highlightOption(optionList, index) {
        optionList.forEach(opt => opt.classList.remove('highlighted'));
        if (optionList[index]) {
            optionList[index].classList.add('highlighted');
        }
    }

    // Handle selecting an option
    function selectOption(opt) {
        if (isCurrencySelector) {
            allOptions.forEach(o => o.classList.remove('selected'));
            opt.classList.add('selected');

            span.innerHTML = opt.innerHTML;
            Select.classList.remove('open');
            isRotated = false;
            if(arrow) arrow.style.transform = 'rotate(0deg)';

            const value = opt.dataset.value;
            currentCurrency = value;
            localStorage.setItem('currency', value);
            handleCurrencyChange(); // run currency logic
        }
    }

    // Toggle dropdown on click
    Select.addEventListener('click', (e) => {
        if (!options.contains(e.target)) {
            Select.classList.toggle('open');
            isRotated = !isRotated;
            if(arrow) arrow.style.transform = isRotated ? 'rotate(180deg)' : 'rotate(0deg)';
        }
    });

    // Select by clicking
    allOptions.forEach(opt => {
        opt.addEventListener('click', () => selectOption(opt));
    });

    // Keyboard support
    Select.addEventListener('keydown', (e) => {
        const isOpen = Select.classList.contains('open');

        const visibleOptions = Array.from(Select.querySelectorAll('.option'))
            .filter(opt => !opt.classList.contains('selected'));

        if (!visibleOptions.length) return;

        if ((e.key === 'Enter' || e.key === ' ') && focusedIndex === -1) {
            e.preventDefault();
            Select.classList.toggle('open');
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (!isOpen) Select.classList.add('open');
            focusedIndex = (focusedIndex + 1) % visibleOptions.length;
            highlightOption(visibleOptions, focusedIndex);
        }

        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (!isOpen) Select.classList.add('open');
            focusedIndex = (focusedIndex - 1 + visibleOptions.length) % visibleOptions.length;
            highlightOption(visibleOptions, focusedIndex);
        }

        else if ((e.key === 'Enter' || e.key === ' ') && isOpen && focusedIndex !== -1) {
            e.preventDefault();
            visibleOptions[focusedIndex].click();
            focusedIndex = -1;
        }
    });

    // Close on blur
    Select.addEventListener('blur', () => {
        allOptions.forEach(opt => opt.classList.remove('highlighted'));
        setTimeout(()=>{
            Select.classList.remove('open');
        }, 300) // delay to allow for click event
        isRotated = false;
        if(arrow) arrow.style.transform = 'rotate(0deg)';
        focusedIndex = -1;
    });
});

/*
// used to refresh various categries

function refreshFilteredCategory() {
    const { category, parent, otherParent, mode } = lastFilter;
    if (category && parent) {
        filterByCategory(category, parent, otherParent, mode);
    }
}

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

// Re-render with updated prices
function refreshCategoryBlock(labelText, items, parent, mode) {
    // Remove all existing children
    if (parent) parent.innerHTML = '';

    // Re-render updated block with new currency values
    renderCategoryBlock(labelText, items, parent, mode);
}


// this uses the cached IDs to refresh content(used after changing currency) this is unreliable, it refreshes the category contents on the screen and needs tracking -- not ideal when adding html
function updateCategoryContent(){
    for (const containerId in shownProductIdsBySection) {
        changeCategoryContent('cached', containerId);
    }
    refreshMoreSections();
    refreshCategoryBlock('All Products', shuffledInitial, productContainer);
    refreshFilteredCategory();
    updateCurrencyIcons(currentCurrency);
}
*/

// convert prices of all products
function applyCurrencyConversion() {
    products.forEach(p => {
        if (!p.originalPrice) p.originalPrice = p.price;
        p.price = convertPrice(p.originalPrice, currentCurrency);
    });
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
    new ThemeManager();
    
    // Refresh contents on load
    if (document.getElementById('vehicles'))
        changeCategoryContent('Cars', 'vehicles');

    if (document.getElementById('electronics'))
        changeCategoryContent('Printers', 'electronics');

    if (document.getElementById('recommended'))
        changeCategoryContent('random', 'recommended');

    if (document.getElementById('hot'))
        changeCategoryContent('random', 'hot');

    updateCurrencyIcons();    

    // fetchRates from API
    await fetchRates();
});

let moreSections = []; // Stores each loaded section
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
        updateCurrencyIcons();
        // Hide the button immediately if last load
        if (noMoreToLoad) {
            document.querySelector('.load-section').innerHTML = '<p>You\'ve Reached the End, <a href="./cart.html">View all products</a></p>';
        }
    }, Math.floor(Math.random() * 100) + 1000);
    
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
            filterByCategory(category, productContainer, productContainer, 'full');
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

    const filtered = mode === 'filtered'? 
        shuffleArray(products.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase()) || 
                    p.name.toLowerCase().includes(selectedCategory.toLowerCase()))) 
        : shuffleArray(products.filter(p => p.category.toLowerCase().includes(selectedCategory.toLowerCase())));
    
    // Separate cart products from other products
    const cartProductIds = cart.map(item => item.id);
    const cartProducts = filtered.filter(p => cartProductIds.includes(p.id));
    const nonCartProducts = filtered.filter(p => !cartProductIds.includes(p.id));
    
    // Combine: cart products first, then others
    const top = [...cartProducts, ...nonCartProducts];
    
    // Show results from the search
    if (top.length > 0) {
        const categoryLabel = top.length > 0 ? top[0].category : selectedCategory;
        renderCategoryBlock(mode === 'filtered'?`Search results for ${selectedCategory}`:categoryLabel, top, parent, mode); 
    } else {
        // No exact matches found, show suggestions
        const suggestionNames = shuffleArray(products.map(p => p.name)).slice(0, 5).join(', ');
        parent.innerHTML = `<p>No exact matches found. Try something like: ${suggestionNames}</p>`;
        setTimeout(() => {
            parent.style.display = 'none';
            parent.innerHTML = '';
        }, 4500);
    }

    // Show remaining products under "Other Products" section
    const rest = shuffleArray(
        products.filter(p => p.category.toLowerCase() !== selectedCategory.toLowerCase())
    );

    if (rest.length > 0 && otherParent) {
        renderCategoryBlock('Other Products', rest, otherParent);
    }
    updateCurrencyIcons();
}

// Render a labeled block of products under a given heading
function renderCategoryBlock(labelText, items, parent, mode, sliceFrom = 0, sliceTo = visibleCount) {
    const block = document.createElement('div');
    block.className = 'category-block';

    const label = document.createElement('h2');
    label.textContent = labelText;
    block.appendChild(label);

    renderProduct(items, block, mode, sliceFrom, sliceTo);
    if(parent) parent.appendChild(block);
}

// e.g. 12, 20, etc. items to render based on screen size
function getVisibleCount() {
    const width = window.innerWidth;
    
    if (width >= 1200) return 60;
    else if (width >= 992) return 48;
    else if (width >= 768) return 36;
    else if (width >= 576) return 24;
    else return 12;
}
let initialVisibleCount = getVisibleCount();
let visibleCount = getVisibleCount();

// update visible count on screen resize
window.addEventListener('resize', () => {
    const newVisibleCount = getVisibleCount();

    // Only update if user hasn't clicked "Show More" yet
    if (visibleCount === initialVisibleCount) {
        visibleCount = newVisibleCount;
        initialVisibleCount = newVisibleCount;

        // re-render initial products if layout changes
        const showMoreContent = document.getElementById('showMoreContent');
        if (productContainer) {
            productContainer.innerHTML = '';
            renderCategoryBlock('All Products', shuffledInitial, productContainer);
        }
        if (showMoreContent) showMoreContent.innerHTML = '';

         // Restore "All" button as active
        const allButton = document.querySelector('.category-btn:first-child');
        if (allButton) setActiveButton(allButton);

        // Update show/hide state of the button
        if (showMoreBtn) showMoreBtn.style.display = products.length > visibleCount ? 'flex' : 'none';
        if (showLessBtn) showLessBtn.style.display = 'none';
    }
});

// Render product cards inside a given container
function renderProduct(items, parent, mode = 'full', sliceFrom = 0, sliceTo = visibleCount) {
    // Convert prices of all products on load to correctly load from the local storage
    applyCurrencyConversion();

    const group = document.createElement('div');
    group.className = 'product-group';

    // Don't slice if we're showing cart products - show all cart items
    const cartProductIds = cart.map(item => item.id);
    const cartProducts = items.filter(p => cartProductIds.includes(p.id));
    const nonCartProducts = items.filter(p => !cartProductIds.includes(p.id));
    
    // Show all cart products + sliced non-cart products
    const maxNonCartItems = Math.max(0, sliceTo - cartProducts.length);
    const productsToShow = [
        ...cartProducts, // All cart products (no slicing)
        ...nonCartProducts.slice(sliceFrom, maxNonCartItems)
    ];

    productsToShow.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card card';
        card.setAttribute('data-id', product.id);

        // Add visual indicator for cart items
        const isInCart = cartProductIds.includes(product.id);
        
        if (mode === 'filtered') {
            card.setAttribute('onclick', `goTo('${product.category}', '${product.id}')`);
            card.innerHTML = `
                <img src="./Assets/car1.jpg" alt="${product.name}" class="product-image" />
                <h4>${product.name} ${isInCart ? '<span class="cart-badge">In Cart</span>' : ''}</h4>
                <div class="card-info">
                    <p>Discover the latest electronic</p>
                    <a href="#"><i class="ri-arrow-right-up-long-line"></i></a>
                </div>
                <h3 class="product-price"><i class="currency-icon"></i>${product.price.toLocaleString()}</h3>
            `;
        } else {
            card.className = 'product-card cart-card';
            card.setAttribute('onclick', `goTo('${product.category}', '${product.id}', 'product.html')`);

            card.innerHTML = `
                <img src="./Assets/car1.jpg" alt="${product.name}" class="product-image" />
                <h4>${product.name}</h4>
                <h3 class="product-price"><i class="currency-icon"></i>${product.price.toLocaleString()}</h3>
                <button class="add-to-cart-btn" onClick="addToCart(${product.id}, this, event)">Add To Cart</button>
            `;
            
            
        }

        group.appendChild(card);
    });

    if (parent) parent.appendChild(group);
    updateCurrencyIcons();
}

const showMoreBtn = document.getElementById('showMoreBtn');
const showMoreContent = document.getElementById('showMoreContent');
const showLessBtn = document.getElementById('showLessBtn');

function showMoreProductsAlternative() {
    const showMoreContent = document.getElementById('showMoreContent');
    const showLessBtn = document.getElementById('showLessBtn');
    
    if (!showMoreBtn || !products || !showMoreContent || !showLessBtn) return;

    showMoreBtn.style.display = products.length > visibleCount ? 'flex' : 'none';
    showLessBtn.style.display = 'none';

    // Remove existing listeners to prevent duplication
    const newShowMoreBtn = showMoreBtn.cloneNode(true);
    const newShowLessBtn = showLessBtn.cloneNode(true);
    showMoreBtn.parentNode.replaceChild(newShowMoreBtn, showMoreBtn);
    showLessBtn.parentNode.replaceChild(newShowLessBtn, showLessBtn);

    newShowMoreBtn.addEventListener('click', () => {
        const start = visibleCount;
        const end = Math.min(visibleCount + 4, products.length);
        const nextBatch = shuffledInitial.slice(start, end);
        spinIcon(newShowMoreBtn.querySelector('i'));

        // Re-render from the start to new visible count
        setTimeout(() => {
            renderProduct(nextBatch, showMoreContent, 'full');
            visibleCount = end;
            
            if (visibleCount >= products.length) {
                newShowMoreBtn.style.display = 'none';
            }

            newShowLessBtn.style.display = visibleCount > initialVisibleCount ? 'flex' : 'none';
        }, Math.floor(Math.random() * 100) + 1000);
    });

    newShowLessBtn.addEventListener('click', () => {
        spinIcon(newShowLessBtn.querySelector('i'));
        setTimeout(() => {
            showMoreContent.innerHTML = ''; // Clear additional products
            newShowLessBtn.style.display = 'none';
            newShowMoreBtn.style.display = products.length > visibleCount ? 'flex' : 'none';
            visibleCount = initialVisibleCount;
        }, Math.floor(Math.random() * 100) + 1000);
    });
}

showMoreProductsAlternative();

// function to go to cart.html with selected category and product
function goTo(category, product, location = 'cart.html') {
    const timestamp = Date.now(); // force unique URL
    const url = `./${location}?${category!==''?`category=${encodeURIComponent(category)}&`:''}${product?`product=${encodeURIComponent(product)}`:''}&t=${timestamp}`;
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

// If a specific product is selected, scroll to it
function scrollToProductById(id, matchClass = 'highlighted') {
    const match = document.querySelector(`[data-id="${id}"]`);
    if (match) {
        match.scrollIntoView({ behavior: 'smooth', block: 'center' });
        match.classList.add(matchClass);
        setTimeout(() => {
            match.classList.remove(matchClass);
        }, 2000);
    }
}

// Scroll to the spectific product after rendering
if (selectedProduct) {
    setTimeout(() => {
        if(!window.location.href.includes('checkout.html')){
            scrollToProductById(selectedProduct);
        }else{
            // check if the product is in cart before scrolling to it
            const cartCheck = cart.some(cartItem => Number(cartItem.id) === Number(selectedProduct)); // converts both to number then checks
            if(cartCheck) scrollToProductById(selectedProduct);
        }
    }, 100); // delay to ensure rendering is done
}

let conversionRates = {};

// get rates from api
async function fetchRates() {
    try {
        // const res = await fetch(`https://v6.exchangerate-api.com/v6/bb966c4d6129c5d3224cee33/latest/${currentCurrency}`);
        // const data = await res.json();
        // conversionRates = data['conversion_rates'];
        conversionRates = exchangeRates['rates'];
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
function convertPrice(basePrice, targetCurrency = currentCurrency) {
    targetCurrency = targetCurrency.toUpperCase();

    const quotes = getRatesFromStorage() || exchangeRates['rates'];
    const targetRate = quotes[targetCurrency];
        
    if (!targetRate) {
        console.warn(`No rate found for NGN to ${targetCurrency}`);
        return basePrice;
    }

    const convertedPrice = +(basePrice * targetRate).toFixed(2);

    return convertedPrice;
}

function updateCurrencyIcons() {
    const Icons = {
        usd: 'fa-dollar-sign',
        eur: 'fa-euro-sign',
        ngn: 'fa-naira-sign',
        gbp: 'fa-pound-sign'
    };

    const iconClass = Icons[currentCurrency] || 'fa-naira-sign';
    document.querySelectorAll('.currency-icon').forEach(icon => {
        icon.className = `currency-icon fa ${iconClass}`;
    });
}

/*
// would work, but now there's different logic, so it needs change
function handleCurrencyChange(selectedCurrency){
    if (selectedCurrency === currentCurrency) {
        products.forEach(p => {
            if (!p.originalPrice) p.originalPrice = p.price;
            p.price = p.originalPrice
        });
    } else {
        currentCurrency = selectedCurrency;
        products.forEach(p => {
            if (!p.originalPrice) p.originalPrice = p.price;
            p.price = convertPrice(p.originalPrice, selectedCurrency);
    });
    updateCategoryContent();
    updateCurrencyIcons(currentCurrency);
*/

// rebuild html of the price and update icons
function handleCurrencyChange(){
    // convert all product prices
    applyCurrencyConversion();

    // update price text in the DOM
    products.forEach(product => {
        const card = document.querySelector(`[data-id="${product.id}"]`);
        if (card) {
            const priceTag = card.querySelector('.product-price');
            const discount = card.querySelector('.discounted-price');
            const currentPrice = product.price - (product.price * product.discount) / 100;
            if (priceTag) {
                priceTag.innerHTML = `
                    <i class="currency-icon"></i>
                    ${product.price.toLocaleString()}
                `;
            }
            if (discount) {
                discount.innerHTML = `
                    <i class="currency-icon"></i>
                    ${currentPrice.toLocaleString()}
                `;
            }
        }
        updateCurrencyIcons();
    });

    if(window.location.href.includes('checkout.html')) updateSummary();
    // Update price in products page
    const originalPrice = Math.floor(currentProduct.price * 1.2);
    if(document.getElementById('currentPrice')) document.getElementById('currentPrice').innerHTML = `<i class="currency-icon"></i>${currentProduct.price.toLocaleString()}`
    if(document.getElementById('originalPrice')) document.getElementById('originalPrice').innerHTML = `<i class="currency-icon"></i>${originalPrice.toLocaleString()}`;
    updateCurrencyIcons();
}

function addToCart(id, btnElement = null, event) {
    event.stopPropagation(); // prevent triggering parent onclick

    const product = products.find(p => p.id === id); // find the product
    if (!product) return console.warn(`Product with ID ${id} not found`);

    // random promotions
    const promoOptions = [
        { discount: 15, badges: ["Hot Deal"] },
        { discount: 25, badges: ["Clearance"] },
        { discount: 10, badges: ["Limited Stock"] },
        { discount: 30, badges: ["Big Sale"] }
    ];
    const randomPromo = promoOptions[Math.floor(Math.random() * promoOptions.length)];

    // Check if already in cart with same variants
    const existing = cart.find(p =>
        p.id === id &&
        p.selectedColor === selectedColor &&
        p.selectedModel === selectedModel
    );

    if (!existing) {
        // Add product with selected options
        const productWithOptions = {
            ...product,
            selectedColor,
            selectedModel,
            variants: [selectedColor, selectedModel],
            selected: true,
            discount: randomPromo.discount,
            badges: randomPromo.badges,
            quantity
        };

        cart.push(productWithOptions);
        updateCartStorage();
        updateCartCount();

        console.log(`Added ${product.name} (${selectedColor}, ${selectedModel}) to cart`);
        if (btnElement) btnElement.innerHTML = 'Added ✓';
    } else {
        // Just increase quantity
        existing.quantity += quantity;
        updateCartStorage();
        updateCartCount();

        console.log(`Updated ${product.name} (${selectedColor}, ${selectedModel}) quantity in cart`);
        if (btnElement) btnElement.innerHTML = 'Updated ✓';
    }

    // UI feedback for the button
    if (btnElement) {
        btnElement.style.background = '#28a745';
        btnElement.disabled = true;

        setTimeout(() => {
            btnElement.innerHTML = 'Add to Cart';
            btnElement.style.background = 'var(--accent-color)';
            btnElement.disabled = false;
            // Re-render cart if on checkout page
            if (window.location.href.includes('checkout.html')) {
                renderCartProducts();
                renderRelatedProducts('checkout');
            }

            // Update cart display if on product page
            if (window.location.href.includes('product.html')) {
                updateCartQuantityDisplay();
                renderRelatedProducts();
            }
        }, 2000);
    }
}

function updateCartCount() {
    const totalCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0); // The total quantity
    
    const cartCounter = document.getElementById('cart-count');
    const homecartCounter = document.querySelectorAll('.count-badge');
    
    if (cartCounter) cartCounter.textContent = totalCount;
    if (homecartCounter){
        homecartCounter.forEach(e => e.textContent = totalCount);
    }

}

function updateCartStorage(){
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const saved = localStorage.getItem('cart');
    cart = saved ? JSON.parse(saved) : [];
    updateCartCount();
}

function isInCart(id) {
    return cart.some(p => p.id === id);
}

function setCartButtonState(btn, id) {
    if (isInCart(id)) {
        btn.textContent = 'Remove From Cart';
        btn.classList.add('remove-from-cart');
    } else {
        btn.textContent = 'Add To Cart';
        btn.classList.remove('remove-from-cart');
    }
}

function updateCartBtn(id, btn) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    btn.disabled = true;

    if (!isInCart(id)) {
        cart.push(product);
        updateCartStorage();
        updateCartCount();

        btn.textContent = 'Added to Cart ✅';
        btn.classList.remove('remove-from-cart');    
        btn.classList.add('waiting-in-cart');

        setTimeout(() => {
            setCartButtonState(btn, id);
            btn.classList.remove('waiting-in-cart');
            btn.disabled = false;
        }, 1000);

    } else {
        cart = cart.filter(p => p.id !== id);
        updateCartStorage();
        updateCartCount();

        btn.textContent = 'Removed ❌';
        btn.classList.remove('remove-from-cart');
        btn.classList.add('waiting-in-cart');

        setTimeout(() => {
            setCartButtonState(btn, id);
            btn.classList.remove('waiting-in-cart');
            btn.disabled = false;
        }, 1000);
    }
}

const cartToggleBtn = document.querySelectorAll('.cart-toggle');
const cartOpener = document.getElementById('open-cart');
const cartPanel = document.querySelector('.cart-panel');
const cartOverlay = document.querySelector('.cart-overlay');

// Open / close cart panel
function toggleCart() {
    renderCartItems();
    if(!cartPanel.classList.contains('visible')){
        cartPanel.classList.add('visible');
        cartOverlay.classList.add('visible');
        cartOpener.classList.add('active');
    }else{
        cartPanel.classList.remove('visible');
        cartOverlay.classList.remove('visible');
        cartOpener.classList.remove('active');
    }
}

if(cartToggleBtn) cartToggleBtn.forEach(Btn => Btn.addEventListener('click', toggleCart));
if(cartOpener) cartOpener.addEventListener('click', toggleCart);

if(cartOverlay) cartOverlay.addEventListener('click', toggleCart);

// Swipe to close (mobile)
let startX = 0;

// Add touch event listeners to the cart panel
if(cartPanel) {
    cartPanel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    cartPanel.addEventListener('touchend', (e) => {
    const endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) {
        closeCart();
    }
    });
}

// Render cart items in the cart panel
function renderCartItems() {
    const container = document.getElementById('cart-items');
        container.innerHTML = '';

    if (cart.length === 0) {
        container.innerHTML = '<p>Your cart is empty 💤</p>';
        const totalContainer = document.getElementById('cart-total');
        if (totalContainer) {
            totalContainer.innerHTML = `<h3>Total: <i class="currency-icon"></i>0</h3>`;
        }
        updateCurrencyIcons(); // Update icons in cart as well
        return;
    }

    cart.forEach(p => {
        const converted = convertPrice(p.originalPrice, currentCurrency);
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        itemDiv.innerHTML = `
            <div title="Check Product" class="cart-info" data-id="${p.id}">
            <img src="./Assets/car1.jpg" alt="${p.name}" class="cart-item-image" />
            <p>${p.name}</p>
            </div>
            <p><i class="currency-icon"></i>${converted.toLocaleString()}</p>
            <button class="remove-cart-item${isInCart(p.id) ? ' remove-from-cart' : ''}" data-id="${p.id}">
            ${isInCart(p.id) ? 'Remove From Cart' : 'Add To Cart'}
            </button>
        `;

        const cartInfo = itemDiv.querySelector('.cart-info');

        cartInfo.addEventListener('click', () => {
            const productId = cartInfo.getAttribute('data-id');
            scrollToProductById(productId, 'glowhighlighted');
            closeCart();
        });

        const removeBtn = itemDiv.querySelector('.remove-cart-item');
        removeBtn.addEventListener('click', () => {
            updateCartBtn(p.id, removeBtn);
            setTimeout(() => {
                renderCartItems();
                // If there are multiple product lists, update all matching buttons for the affected id in the product list
                document.querySelectorAll(`.product-card[data-id='${p.id}'] .add-to-cart-btn`).forEach(btn => {
                    setCartButtonState(btn, p.id);
                });
            }, 1000);
        });

        container.appendChild(itemDiv);
    });
    
    const total = cart.length === 0 ? 0 : cart.reduce((sum, p) => sum + convertPrice(p.originalPrice, currentCurrency), 0);
    const totalContainer = document.getElementById('cart-total');
    if (totalContainer) {
        totalContainer.innerHTML = `<h3>Total: <i class="currency-icon"></i>${total.toLocaleString()}</h3>`;
    }
    
    updateCurrencyIcons();
}

const footer = document.querySelector('.footer');
const bottomNav = document.querySelector('.bottom-nav');
// Hide cart open button when footer is in view and the bottom navbar
if(footer) {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if(bottomNav) bottomNav.classList.add('hide');
                if(cartOpener) cartOpener.classList.add('hide');
            } else {
                if(bottomNav) bottomNav.classList.remove('hide');
                if(cartOpener) cartOpener.classList.remove('hide');
            }
        });
});
observer.observe(footer);
}

// Modals logic
const openContactButtons = document.querySelectorAll('.contact-button');
const overlay = document.querySelector('.overlay');
const modals = document.querySelectorAll('.modal');
const modalCloseBtns = document.querySelectorAll('.modal-close-btn');

// Open modal
function openModal(modalId) {
    overlay.classList.remove('hidden');

    // Hide all modals first
    modals.forEach(m => m.classList.remove('visible'));

    const modalToOpen = document.getElementById(modalId);
    if (modalToOpen) {
        modalToOpen.classList.add('visible');
    }
}

// Close modal
function closeModals() {
    // Check for unsent input in open modal only
    const currentModal = [...modals].find(modal => modal.classList.contains('visible'));

    if (currentModal) {
        const hasInput = [...currentModal.querySelectorAll('input:not([type=submit]):not([type=checkbox]):not([type=hidden]), textarea')]
        .some(el => el.value.trim() !== '');

        if (hasInput) {
            const confirmClose = confirm("You have unsent content. Close anyway?");
            if (!confirmClose) return;
        }
    }
    overlay.classList.add('hidden');
    modals.forEach(m => m.classList.remove('visible'));
}

// Open Contact Modal
openContactButtons.forEach(btn => {
    btn.addEventListener('click', () => openModal('contactModal'));
});

// Open Login & Signup Modal
document.getElementById('openLoginModal')?.addEventListener('click', () => {
    openModal('loginModal');
});

document.getElementById('openSignupModal')?.addEventListener('click', () => {
    openModal('signupModal');
});

// Close Modal button
modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModals));

// Close modals when clicking outside
overlay.addEventListener('click', closeModals);

// Close modals with Escape key
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModals();
    }
});

// Close modals when clicking outside
overlay.addEventListener('click', closeModals);

// toggling light/dark theme
class ThemeManager {
    constructor() {
        this.themeToggles = document.querySelectorAll('[data-theme-toggle]');
        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const currentTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        this.setTheme(currentTheme, false);

        this.themeToggles.forEach(toggle => {
            toggle.addEventListener('click', () => this.toggleTheme());
        });
    }

    setTheme(theme, save = true) {
        const root = document.documentElement;
        const isDark = theme === 'dark';
        root.setAttribute('data-theme', theme);

        this.themeToggles.forEach(toggle => {
            const icon = toggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('ri-moon-fill', !isDark);
                icon.classList.toggle('ri-sun-fill', isDark);
                icon.style.color = isDark ? '#e98409' : '#031632';
            }
            toggle.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
        });

        if (save) localStorage.setItem('theme', theme);
    }

    toggleTheme() {
        const current = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = current === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(()=>{
        if(document.documentElement.classList.contains('loading')){
            document.documentElement.classList.remove('loading');
            console.log('Html did not complete loading (offline?)');
        }
    }, 5000); // Prevent UI from getting stuck
});

function initMobileSearch() {
    const overlay = document.getElementById('mobileSearchOverlay');
    const searchIcon = document.getElementById('mobileSearchIcon');
    const closeBtn = document.getElementById('mobileSearchClose');
    const searchInput = document.getElementById('mobileSearchInput');
    const searchBtn = document.getElementById('mobileSearchBtn');
    const clearBtn = document.getElementById('mobileClearBtn');
    const suggestions = document.getElementById('mobileSuggestions');
    const results = document.getElementById('mobileSearchResults');
    const recentSearches = document.getElementById('recentSearches');

    let selectedIndex = -1;
    let isOpen = false;
    let recentSearchList = getRecentSearches();

    // Open mobile search overlay
    function openSearch() {
        overlay.classList.add('active');
        isOpen = true;
        history.pushState({ searchOpen: true }, '', '');
        setTimeout(() => searchInput.focus(), 300);
        showRecentSearches();
    }

    // Close mobile search overlay
    function closeSearch() {
        overlay.classList.remove('active');
        isOpen = false;
        clearSearch();
        hideSuggestions();
        results.innerHTML = '';
        results.style.display = 'none';
        if (history.state && history.state.searchOpen) {
            history.back();
        }
    }

    function clearSearch() {
        searchInput.value = '';
        clearBtn.classList.remove('show');
        hideSuggestions();
        showRecentSearches();
        results.style.display = 'none';
        selectedIndex = -1;
    }

    // Reset search state to initial state -- shows recent search
    function resetSearchState() {
        searchInput.value = '';
        clearBtn.classList.remove('show');
        hideSuggestions();
        showRecentSearches();
        results.innerHTML = '';
        results.style.display = 'none';
        selectedIndex = -1;
    }

    // Recent searches management
    function getRecentSearches() {
        try {
            const stored = localStorage.getItem('recentSearches');
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            // console.warn('Failed to load recent searches from localStorage:', e);
            return [];
        }
    }

    function saveRecentSearches(searches) {
        try {
            localStorage.setItem('recentSearches', JSON.stringify(searches));
        } catch (e) {
            // console.warn('Failed to save recent searches to localStorage:', e);
        }
    }

    function addRecentSearch(query) {
        if (!query || query.trim() === '') return;
        
        const trimmedQuery = query.trim();
        
        // Remove if already exists to avoid duplicates
        recentSearchList = recentSearchList.filter(item => item !== trimmedQuery);
        
        // Add to beginning of array
        recentSearchList.unshift(trimmedQuery);
        
        // Keep only last 8 searches
        recentSearchList = recentSearchList.slice(0, 8);
        
        // Save to localStorage
        saveRecentSearches(recentSearchList);
    }

    function clearRecentSearches() {
        recentSearchList = [];
        renderRecentSearches();
        try {
            localStorage.removeItem('recentSearches');
        } catch (e) {
            console.warn('Failed to clear recent searches from localStorage:', e);
        }
    }

    function renderRecentSearches() {
        if (!recentSearches) return;
        
        if (recentSearchList.length === 0) {
            recentSearches.innerHTML = `
                <div class="recent-searches-empty">
                    <p>No recent searches</p>
                </div>
            `;
            return;
        }

        recentSearches.innerHTML = `
            <div class="recent-searches-header">
                <h3>Recent Searches</h3>
                <button class="clear-recent-btn" onclick="clearRecentSearches()">Clear All</button>
            </div>
            <div class="recent-searches-list">
                ${recentSearchList.map(search => `
                    <div class="recent-search-item">
                        <i class="ri-time-line"></i>
                        <span class="recent-search-text">${search}</span>
                        <i class="ri-close-line remove-recent" data-search="${search}"></i>
                    </div>
                `).join('')}
            </div>
        `;

        // Add event listeners for recent search items
        const recentItems = recentSearches.querySelectorAll('.recent-search-item');
        recentItems.forEach(item => {
            const searchText = item.querySelector('.recent-search-text');
            const removeBtn = item.querySelector('.remove-recent');
            
            searchText.addEventListener('click', () => {
                const query = searchText.textContent;
                searchInput.value = query;
                performSearch();
            });

            removeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const searchToRemove = removeBtn.dataset.search;
                removeRecentSearch(searchToRemove);
            });
        });
    }

    function removeRecentSearch(searchToRemove) {
        recentSearchList = recentSearchList.filter(item => item !== searchToRemove);
        renderRecentSearches();
        saveRecentSearches(recentSearchList);
    }

    // Show recent searches
    function showRecentSearches() {
        if (recentSearches) {
            renderRecentSearches();
            recentSearches.style.display = 'block';
        }
    }

    function hideRecentSearches() {
        if (recentSearches) {
            recentSearches.style.display = 'none';
        }
    }

    // Using the same search matching logic as previously
    function getSearchMatches(query) {
        query = query.toLowerCase();
        
        const nameMatches = products.filter(p =>
            p.name.toLowerCase().includes(query)
        );
        const categoryMatches = products.filter(p =>
            p.category.toLowerCase().includes(query)
        );

        const cartProductIds = cart.map(item => item.id);
        const cartNames = nameMatches.filter(p => cartProductIds.includes(p.id)).map(p => p.name);
        const nonCartNames = nameMatches.filter(p => !cartProductIds.includes(p.id)).map(p => p.name);

        const names = [...cartNames, ...nonCartNames];
        const categories = [...new Set(categoryMatches.map(p => p.category))];

        return {
            names,
            categories,
            all: [...new Set([...categories, ...names])].slice(0, 6)
        };
    }

    // Check if item is in cart
    function isItemInCart(item) {
        return products.some(p =>
            (p.name === item || p.category === item) &&
            cart.some(cartItem => cartItem.id === p.id)
        );
    }

    // Render suggestions dropdown with cart badges
    function showSuggestions(query) {
        const matches = getSearchMatches(query).all;
        if (matches.length === 0) {
            hideSuggestions();
            return;
        }

        suggestions.innerHTML = '';
        matches.forEach(match => {
            const div = document.createElement('div');
            const inCart = isItemInCart(match);

            div.classList.add('mobile-suggestion-item');
            if (inCart) div.classList.add('in-cart-suggestion');

            div.innerHTML = `
                <span>${match}</span>
                ${inCart ? '<span class="cart-badge-mobile">In Cart</span>' : ''}
            `;

            div.addEventListener('click', () => {
                searchInput.value = match;
                performSearch();
            });

            suggestions.appendChild(div);
        });

        suggestions.classList.add('show');
        selectedIndex = -1;
    }

    function hideSuggestions() {
        suggestions.classList.remove('show');
        selectedIndex = -1;
    }

    // Handle input change
    function handleInput(e) {
        const query = e.target.value.trim();
        if (query) {
            clearBtn.classList.add('show');
            hideRecentSearches();
            showSuggestions(query);
        } else {
            clearBtn.classList.remove('show');
            hideSuggestions();
            showRecentSearches();
        }
    }

    // Handle keyboard navigation in suggestions
    function handleKeydown(e) {
        const items = suggestions.querySelectorAll('.mobile-suggestion-item');
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
            updateHighlight(items);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selectedIndex = Math.max(selectedIndex - 1, -1);
            updateHighlight(items);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (selectedIndex >= 0 && items[selectedIndex]) {
                items[selectedIndex].click();
            } else {
                performSearch();
            }
        } else if (e.key === 'Escape') {
            closeSearch();
        }
    }

    // Highlight currently selected suggestion for keyboard nav
    function updateHighlight(items) {
        items.forEach(item => item.classList.remove('active'));
        if (selectedIndex >= 0 && items[selectedIndex]) {
            items[selectedIndex].classList.add('active');
        }
    }

    // Set placeholder message for invalid or empty search input
    function setTemporaryPlaceholder(msg, inputContainer = searchInput) {
        const original = inputContainer.getAttribute('data-original') || inputContainer.placeholder;

        if (!inputContainer.getAttribute('data-original')) {
            inputContainer.setAttribute('data-original', original);
        }

        inputContainer.placeholder = msg;
        inputContainer.classList.add('shake');
        setTimeout(() => inputContainer.classList.remove('shake'), 400);
        inputContainer.value = '';

        setTimeout(() => {
            inputContainer.placeholder = inputContainer.getAttribute('data-original');
            // Reset to initial state after showing the error message
            resetSearchState();
        }, 2500);
    }

    // Perform actual search - now matches desktop behavior
    function performSearch() {
        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            setTemporaryPlaceholder('Please type something...', searchInput);
            return;
        }

        // Add to recent searches
        addRecentSearch(query);

        hideSuggestions();
        hideRecentSearches();
        
        const { categories, names } = getSearchMatches(query);

        // Reset results container
        results.innerHTML = '';
        results.style.display = 'none';

        if (categories.length > 0) {
            // Found category match - look for matching category button and click it
            const categoryName = categories[0].toLowerCase();
            const matchingBtn = Array.from(document.querySelectorAll('.category-btn')).find(btn => 
                btn.textContent.toLowerCase() === categoryName
            );

            if (matchingBtn) {
                // Close mobile search overlay first
                closeSearch();
                
                // Click the category button and scroll to it
                matchingBtn.click();
                matchingBtn.scrollIntoView({ behavior: 'smooth', inline: 'center' });
                
                // Don't show filtered results since we're using category button
                return;
            }
        }

        // If no category button found, or only product matches, show filtered results
        if (categories.length > 0 || names.length > 0) {
            filterByCategory(query, results, null, 'filtered');
            results.style.display = 'grid';
            
            // Update currency icons after rendering
            updateCurrencyIcons();
        } else {
            // No results found - show error message and reset after delay
            setTemporaryPlaceholder(`No results for "${query}"`);
            results.style.display = 'none';
        }

        console.log('Mobile search results:', getSearchMatches(query));
    }

    // Event listeners
    searchIcon.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('keydown', handleKeydown);
    searchBtn.addEventListener('click', performSearch);
    clearBtn.addEventListener('click', clearSearch);

    // Make clearRecentSearches globally accessible for the onclick handler
    window.clearRecentSearches = clearRecentSearches;

    // Close overlay when clicking outside
    overlay.addEventListener('click', e => {
        if (e.target === overlay) closeSearch();
    });

    // Handle browser back button
    window.addEventListener('popstate', () => {
        if (isOpen) closeSearch();
    });
}

// Initialize mobile search functionality
initMobileSearch();

// typing animation for expandable info sections in the homepage
document.querySelectorAll(".info1").forEach(section => {
    const textEl = section.querySelector(".infoText");
    const btn = section.querySelector(".read-more");

    const shortText = textEl.getAttribute("data-short");
    const fullText = textEl.textContent.trim();
    
    textEl.textContent = shortText;

    let isExpanded = false;
    let typingInterval = null; // to track the current typing process

    function startTyping(text, callback) {
        let index = 0;
        if (typingInterval) clearInterval(typingInterval);

        typingInterval = setInterval(() => {
            if (index <= text.length) {
                textEl.textContent = text.slice(0, index);
                index++;
            } else {
                clearInterval(typingInterval);
                typingInterval = null;
                if (callback) callback();
            }
        }, 40); //Typing speed
    }

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (!isExpanded) {
            textEl.textContent = "";
            startTyping(fullText);
            btn.textContent = "Show Less";
            isExpanded = true;
        } else {
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
        textEl.textContent = shortText; // reset the current text in the paragraph
        btn.textContent = "Read More";
        isExpanded = false;
        }
    });
});

/*************************** Product Page *************************/
// Get product ID from URL or use first product
const urlParams = new URLSearchParams(window.location.search);
const productId = parseInt(urlParams.get('product')) || 1;
const currentProduct = products.find(p => p.id === productId) || products[0];

let selectedColor = 'default';
let selectedModel = 'standard';
let quantity = 1;

// Color options
const colors = ['Black', 'Blue', 'Red', 'Green', 'Purple', 'White'];
const models = ['Standard', 'Pro', 'Max', 'Ultra', 'Premium'];

function renderStars(rating) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHTML += '<i class="fas fa-star star"></i>';
        } else {
            starsHTML += '<i class="far fa-star star"></i>';
        }
    }
    return starsHTML;
}

// Get total quantity of a product in cart (all variants)
function getTotalCartQuantity(id) {
    return cart
        .filter(item => item.id === id)
        .reduce((total, item) => total + item.quantity, 0);
}

// Get quantity of specific color variant in cart
function getColorCartQuantity(id, color) {
    return cart
        .filter(item => item.id === id && item.selectedColor === color)
        .reduce((total, item) => total + item.quantity, 0);
}

// Get quantity of specific model variant in cart
function getModelCartQuantity(id, model) {
    return cart
        .filter(item => item.id === id && item.selectedModel === model)
        .reduce((total, item) => total + item.quantity, 0);
}

// Update cart quantity displays
function updateCartQuantityDisplay() {
    const totalInCart = getTotalCartQuantity(currentProduct.id);
    const modelInCart = getModelCartQuantity(currentProduct.id, selectedModel);
    const colorInCart = getColorCartQuantity(currentProduct.id, selectedColor);
    
    document.getElementById('totalInCart').textContent = totalInCart;
    document.getElementById('modelInCart').textContent = modelInCart;
    document.getElementById('colorInCart').textContent = colorInCart;
    
    // Update labels with current selections
    document.getElementById('selectedModelLabel').textContent = `${selectedModel}:`;
    document.getElementById('selectedColorLabel').textContent = `${selectedColor}:`;
}

function initializeProduct() {
    // Update breadcrumb
    document.getElementById('categoryBreadcrumb').textContent = currentProduct.category;
    document.getElementById('productBreadcrumb').textContent = currentProduct.name;
    
    // Update product info
    document.getElementById('productTitle').textContent = currentProduct.name;
    document.getElementById('mainImage').src = './Assets/car1.jpg';
    document.getElementById('mainImage').alt = currentProduct.name;
    
    // Generate random rating and sales
    const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
    const soldCount = Math.floor(Math.random() * 500) + 50;
    
    document.getElementById('productStars').innerHTML = renderStars(Math.floor(rating));
    document.getElementById('ratingValue').textContent = rating;
    document.getElementById('soldCount').textContent = `${soldCount} sold`;
    
    // Update price
    const originalPrice = Math.floor(currentProduct.price * 1.2);
    document.getElementById('currentPrice').innerHTML = `<i class="currency-icon"></i>${currentProduct.price.toLocaleString()}`
    document.getElementById('originalPrice').innerHTML = `<i class="currency-icon"></i>${originalPrice.toLocaleString()}`;
    
    // Generate thumbnails
    const thumbnailList = document.getElementById('thumbnailList');
    for (let i = 0; i < 4; i++) {
        const thumb = document.createElement('div');
        thumb.className = i === 0 ? 'thumbnail active' : 'thumbnail';
        thumb.innerHTML = `<img src="./Assets/car1.jpg" alt="${currentProduct.name}">`;
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
        thumbnailList.appendChild(thumb);
    }
    
    // Generate color options
    const colorOptions = document.getElementById('colorOptions');
    colors.slice(0, 4).forEach((color, index) => {
        const option = document.createElement('div');
        option.className = index === 0 ? 'color-option active' : 'color-option';
        option.innerHTML = `
            <img src="./Assets/car1.jpg" alt="${color}">
            <div class="color-name">${color}</div>
        `;
        option.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedColor = color;
            updateCartQuantityDisplay(); // Update display when color changes
        });
        colorOptions.appendChild(option);
    });
    
    // Generate model options
    const modelOptions = document.getElementById('modelOptions');
    models.slice(0, 3).forEach((model, index) => {
        const option = document.createElement('div');
        option.className = index === 0 ? 'model-option active' : 'model-option';
        option.textContent = model;
        option.addEventListener('click', () => {
            document.querySelectorAll('.model-option').forEach(opt => opt.classList.remove('active'));
            option.classList.add('active');
            selectedModel = model;
            updateCartQuantityDisplay(); // Update display when model changes
        });
        modelOptions.appendChild(option);
    });
    
    selectedColor = colors[0];
    selectedModel = models[0];
    
    // Initialize cart quantity display
    updateCartQuantityDisplay();

    // Quantity controls    
    document.getElementById('decreaseBtn').addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            document.getElementById('quantityDisplay').textContent = quantity;
        }
    });

    document.getElementById('increaseBtn').addEventListener('click', () => {
        quantity++;
        document.getElementById('quantityDisplay').textContent = quantity;
    });

    // link to checkout page
    document.querySelector('.cart-quantities').addEventListener('click', ()=>{goTo('', currentProduct.id, 'checkout.html')})

    document.querySelector('.add-to-cart-btn').addEventListener('click', function () {
        addToCart(currentProduct.id, this, event);
    });
}

// Random letters for the name in reviews
function getRandomLetter() {
    const letters = "abcdefghijklmnopqrstuvwxyz";
    return letters[Math.floor(Math.random() * letters.length)];
}

// Random names using random letters in reviews
function generateRandomName() {
    const firstLetter = getRandomLetter().toUpperCase();
    const midLength = Math.floor(Math.random() * 3) + 2; // 2–4 letters
    const mid = Array.from({ length: midLength }, getRandomLetter).join(""); //  creates an array of midLength size and fills it with random letters
    const end = getRandomLetter() + getRandomLetter();
    return `${firstLetter}${mid}****${end}`; // mask the middle using ****
}

// Get random dates the reviews were made
function getRandomDate() {
    const now = new Date();
    const daysAgo = Math.floor(Math.random() * 30); // random day in last 30
    const date = new Date(now.setDate(now.getDate() - daysAgo));
    return date.toISOString().split("T")[0];
}

// to generate the entire reviews array
function generateRandomReviews(count = 6) {
    const sampleComments = [
        "Absolutely love this product!",
        "Great quality and fast delivery.",
        "Good value for the price.",
        "Packaging could be better.",
        "Customer service was helpful.",
        "Not bad. I'd buy again.",
        "Very satisfied overall.",
        "Exceeded my expectations.",
        "It does the job perfectly!",
        "One of my best purchases this year!"
    ];

    const reviews = [];
    for (let i = 0; i < count; i++) {
        reviews.push({
            name: generateRandomName(),
            rating: Math.floor(Math.random() * 3) + 3, // 3–5 stars
            comment: sampleComments[Math.floor(Math.random() * sampleComments.length)],
            date: getRandomDate()
        });
    }
    return reviews;
}

// for review generation to the page
function generateReviews() {
    const reviewCount = Math.floor(Math.random() * 25) + 5;
    const avgRating = (Math.random() * 1.5 + 3.5).toFixed(1);
    
    document.getElementById('reviewsTitle').textContent = `${reviewCount} reviews`;
    document.getElementById('reviewStars').innerHTML = renderStars(Math.floor(avgRating));
    document.getElementById('reviewRating').textContent = avgRating;
    
    const reviewsList = document.getElementById('reviewsList');
    
    // Generate all reviews at once
    const allReviews = generateRandomReviews(reviewCount);
    
    allReviews.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.className = 'review-item';
        reviewItem.innerHTML = `
            <div class="review-header">
                <span class="reviewer-name">${review.name}</span>
                <span class="review-date">on ${review.date}</span>
            </div>
            <div class="review-stars">
                ${renderStars(review.rating)}
            </div>
            <p class="review-text">${review.comment}</p>
        `;
        reviewsList.appendChild(reviewItem);
    });
}

function renderRelatedProducts(mode = 'product') {
    let relatedProducts = [];

    if (mode === 'checkout') {
        const cartIds = cart.map(item => item.id);

        relatedProducts = products
            .filter(p => !cartIds.includes(p.id)) // exclude cart items
            .sort(() => Math.random() - 0.5)
            .slice(0, 16); // Get 16 items

        relatedProducts.forEach(related => {
            cart.forEach(cartItem => {
                if (related.id === cartItem.id) {
                    console.warn(`MATCH FOUND ❌: Product ID ${related.id} is in both cart and relatedProducts`);
                }
            });
        });

    }else{
        relatedProducts = products
        .filter(p => p.id !== currentProduct.id) //ensure its not the current product
        .sort(() => Math.random() - 0.5) //shuffle it randomly
        .slice(0, 16); // get 16 products
    }

    const grid = document.getElementById('relatedProductsGrid');
    grid.innerHTML = ''; // clears previously related products
    
    relatedProducts.forEach(p => {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.innerHTML = `
            <div class="product-card-info" data-id="${p.id}">
                <img src="./Assets/car1.jpg" alt="${p.name}" class="product-image" />
                <h4>${p.name}</h4>
                <h3 class="product-price"><i class="currency-icon"></i>${convertPrice(p.originalPrice).toLocaleString()}</h3>
                <button class="add-to-cart-btn" onclick="addToCart(${p.id}, this, event)">Add to Cart</button>
            </div>
        `;
        
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart-btn')) {
                goTo(p.category, p.id, 'product.html');
            }
        });
        
        grid.appendChild(card);
    });
}

/*************************** Checkout Page *************************/
const checkoutBtn = document.getElementById('checkoutBtn');
const discountData = [
    { discount: 26, selected: true, badges: ["Big sale"] },
    { discount: 10, selected: true, badges: ["Almost sold out"] },
    { discount: 79, selected: true, badges: ["Clearance deal"] },
    { discount: 36, selected: true, badges: ["Only 19 left"] },
];

// Extend or fill discountData to match cart length
for (let i = discountData.length; i < cart.length; i++) {
    discountData.push({ discount: 0, selected: true, badges: ["Big Sale"] });
}

// Update cart directly
cart.forEach((item, index) => {
  const discountItem = discountData[index];

  // Only assign if not already set
  if (!item.hasOwnProperty('variants')) {
    item.variants = [item.selectedColor, item.selectedModel];
  }

  if (!item.hasOwnProperty('selected')) {
    item.selected = discountItem.selected;
  }

  if (!item.hasOwnProperty('badges')) {
    item.badges = discountItem.badges;
  }

  // ensure quantity exists
  if (!item.hasOwnProperty('quantity')) {
    item.quantity = 1;
  }
});

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCartStorage();
    updateCartCount();
    renderCartProducts();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
        updateCartStorage();
        updateCartCount();
        renderCartProducts();
    }
}

function renderCartProducts(){
    const cartItemsContainer = document.getElementById('cartItems');
    cartItemsContainer.innerHTML = '';

    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-product';
        cartItem.setAttribute('data-id', item.id);
        const currentPrice = item.originalPrice - (item.originalPrice * item.discount) / 100;
        cartItem.innerHTML = `
            <input type="checkbox" class="item-checkbox" ${item.selected ? 'checked' : ''} 
                    onchange="toggleItemSelection(${index})">
            <img src="./Assets/car1.jpg" alt="${item.name}" class="item-image" onClick="goTo('${item.category}', '${item.id}', 'product.html')">
            <div class="item-details">
                <div>    
                    <div onClick="goTo('${item.category}', '${item.id}', 'product.html')" class="item-name">${item.name}</div>
                    <div class="item-variant">${item.variants.join('/')}</div>
                </div>
                <div>
                    <div class="item-badges">
                        ${item.badges.map(badge => {
                            return `<span class="badge">${badge}</span>`;
                        }).join('')}
                    </div>
                    <div class="item-price">
                        <div class="discounted-price">
                            ${item.discount>0?`<i class="currency-icon"></i>${convertPrice(currentPrice).toLocaleString()}
                        </div>
                        <div class="product-price">
                            <i class="currency-icon"></i>${convertPrice(item.originalPrice).toLocaleString()}
                        </div>
                        <span class="discount">-${item.discount}%</span>`:`<i class="currency-icon"></i>${item.originalPrice.toLocaleString()}
                        </div>`}
                    </div>
                </div>
            </div>
            <div class="item-actions">
                <div class="remove-btn" onclick="removeItem(${index})">
                    <i class="ri-delete-bin-7-line"></i>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn" onclick="decreaseQuantity(${index})">-</button>
                    <div class="quantity-display">${item.quantity}</div>
                    <button class="quantity-btn" onclick="increaseQuantity(${index})">+</button>
                </div>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });

    // Event listeners
    document.getElementById('selectAll').addEventListener('change', toggleSelectAll);
    checkoutBtn.addEventListener('click', checkout);

    updateSummary();
    updateCurrencyIcons();
    updateSelectAll();
    renderRelatedProducts('checkout');
}

function toggleItemSelection(index) {
    cart[index].selected = !cart[index].selected;
    updateSummary();
    updateSelectAll();
    updateCartStorage();
}

function toggleSelectAll() {
    const selectAll = document.getElementById('selectAll').checked;
    cart.forEach(item => item.selected = selectAll);
    renderCartProducts();
    updateCartStorage();
}

function updateSelectAll() {
    const allSelected = cart.every(item => item.selected);
    const someSelected = cart.some(item => item.selected);
    const selectAllCheckbox = document.getElementById('selectAll');
    
    selectAllCheckbox.checked = allSelected;
    selectAllCheckbox.indeterminate = someSelected && !allSelected;
}

function removeItem(index) {
    const cartItemsContainer = document.getElementById('cartItems');
    const itemElements = cartItemsContainer.getElementsByClassName('cart-product');
    const itemElement = itemElements[index];
    const animationClass = Math.random() < 0.5 ? 'slide-out' : 'slide-up';
    itemElement.classList.add(animationClass);

    setTimeout(() => {
        cart.splice(index, 1);
        updateCartStorage?.();
        renderCartProducts();
    }, 500);
}

function updateSummary() {
    const selectedItems = cart.filter(item => item.selected);
    
    const totalItems = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    const itemsTotal = selectedItems.reduce((sum, item) => sum + (item.originalPrice * item.quantity), 0);
    const discount = selectedItems.reduce((sum, item) => sum + (((item.originalPrice * item.discount) / 100) * item.quantity), 0);
    const currentTotal = itemsTotal - discount;

    document.getElementById('totalItems').textContent = cart.length;
    document.getElementById('itemsTotal').innerHTML = `<i class="currency-icon"></i>${convertPrice(itemsTotal).toLocaleString()}`;
    document.getElementById('itemsDiscount').innerHTML = `-<i class="currency-icon"></i>${convertPrice(discount).toLocaleString()}`;
    document.getElementById('finalTotal').innerHTML = `<i class="currency-icon"></i>${convertPrice(currentTotal).toLocaleString()}`;
    document.getElementById('checkoutItems').textContent = totalItems;

    // Update checkout button state
    if (totalItems === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.style.opacity = '0.5';
        checkoutBtn.style.cursor = 'not-allowed';
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.style.opacity = '1';
        checkoutBtn.style.cursor = 'pointer';
    }
    updateCurrencyIcons();
}

function checkout() {
    checkoutBtn.disabled = true;
    const selectedItems = cart.filter(item => item.selected);
    if (selectedItems.length === 0) {
        alert('Please select at least one item to checkout.');
        checkoutBtn.disabled = false;
        return;
    }
    const itemsQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);
    // check if the user is logged in first
    if (window.isUserLoggedIn && window.isUserLoggedIn()) {
        const confirmCheckout = confirm(`Proceeding to checkout with ${itemsQuantity} item${itemsQuantity>1?'s':''}?`);
        if(confirmCheckout){
            window.checkedOutItems = selectedItems;
            window.sendCheckoutToFirestore(); // calls the function defined in auth.js
        }
    } else {
        alert("Please log in first");
    }
    checkoutBtn.disabled = false;
}

/*************************** Thank you Page *************************/     
const orderId = params.get("orderId") || localStorage.getItem("lastOrderId");

document.getElementById("orderIdDisplay").textContent = orderId || "Unavailable";

// Clean up single-use backup
localStorage.removeItem("lastOrderId");