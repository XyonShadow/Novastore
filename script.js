const searchInput = document.querySelector('.search-box .search-bar input');
const searchIcon = document.querySelector('.search-bar .ri-search-line');
const searchBar = document.querySelector('.search-bar');

// make search icon active when the search input is on focus
searchInput.addEventListener('focus', () => {
    searchIcon.classList.add('active');
});

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
            existingBtn.remove();
        }
    }
}

searchInput.addEventListener('input', checkInput)

// remove active from search icon and check search input on focus change from the search bar
searchInput.addEventListener('blur', () => {
    searchIcon.classList.remove('active');
    checkInput();
});
