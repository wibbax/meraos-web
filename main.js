$(document).ready(function () {
    // Inicializar los sliders
    initializeSliders();

    // Añade la lógica de búsqueda
    $('#search-input').on('input', function () {
        var searchTerm = $(this).val().toLowerCase();
        searchFragrances(searchTerm);
    });
});

function initializeSliders() {
    $('.slider').slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        responsive: getSliderResponsiveSettings()
    });

    $('.slider').on('afterChange', function (event, slick, currentSlide) {
        updateProductInfo(currentSlide);
    });

    $('.custom-prev').click(function () {
        $('.slider').slick('slickPrev');
    });

    $('.custom-next').click(function () {
        $('.slider').slick('slickNext');
    });

    $('.add-to-favorites').click(function () {
        addToFavorites();
    });

    $('.add-to-cart').click(function () {
        addToCart();
    });
}

function getSliderResponsiveSettings() {
    return [
        {
            breakpoint: 1920,
            settings: {
                slidesToShow: 4,
            }
        },
        {
            breakpoint: 1200,
            settings: {
                slidesToShow: 3,
            }
        },
        {
            breakpoint: 768,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 576,
            settings: {
                slidesToShow: 1,
            }
        }
    ];
}

function updateProductInfo(currentSlide) {
    const productInfo = getProductInfoByIndex(currentSlide);
    displayProductInfo(productInfo);
}

function getProductInfoByIndex(index) {
    return {
        title: `Fragancia ${index + 1}`,
        price: `$XXX.XX`,
    };
}

function displayProductInfo(productInfo) {
    $('#product-title').text(productInfo.title);
    $('#product-price').text(`Precio: ${productInfo.price}`);
}

function searchFragrances(term) {
    $('.sliderfemenino, .slidermasculino').hide();

    var searchResultsContainer = $('#search-results');
    searchResultsContainer.toggle(term.length > 0);

    if (term.length > 0) {
        displaySearchResults(term);
    } else {
        $('.sliderfemenino, .slidermasculino').show();
    }
}

function displaySearchResults(term) {
    var searchResultsContainer = $('#search-results');
    searchResultsContainer.empty();

    var femeninoImages = $('.sliderfemenino img');
    var masculinoImages = $('.slidermasculino img');

    filterAndDisplayResults(femeninoImages, term);
    filterAndDisplayResults(masculinoImages, term);
}

function filterAndDisplayResults(images, term) {
    var filteredImages = images.filter(function () {
        return $(this).attr('alt').toLowerCase().includes(term);
    });

    filteredImages.each(function () {
        var imgClone = $(this).clone();
        imgClone.appendTo('#search-results');
    });
}

function showAlert(message) {
    alert(message);
    closeModal();
}

function addToFavorites() {
    const currentSlideIndex = $('.slider').slick('slickCurrentSlide');
    const productInfo = getProductInfoByIndex(currentSlideIndex);
    showAlert(`Fragancia ${productInfo.title} agregada a favoritos.`);
}

function addToCart() {
    const currentSlideIndex = $('.slider').slick('slickCurrentSlide');
    const productInfo = getProductInfoByIndex(currentSlideIndex);
    showAlert(`Fragancia ${productInfo.title} agregada al carrito.`);
}

function getCart() {
    const cartJSON = localStorage.getItem('cart');
    return cartJSON ? JSON.parse(cartJSON) : [];
}

function saveCart(cart) {
    const cartJSON = JSON.stringify(cart);
    localStorage.setItem('cart', cartJSON);
}

// Función para mostrar el contenido del carrito en la página del carrito
function displayCart() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items');

    // Limpiar el contenido anterior
    cartItemsContainer.innerHTML = '';

    // Verificar si el carrito está vacío
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>El carrito está vacío.</p>';
        return;
    }

    // Mostrar cada fragancia en el carrito
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.title}" width="50" height="50">
            <p>${item.title}</p>
            <p>${item.description}</p>
            <button onclick="removeFromCart('${item.title}')">Eliminar</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
}

// Función para eliminar una fragancia del carrito
function removeFromCart(title) {
    const cart = getCart();
    const updatedCart = cart.filter(item => item.title !== title);
    saveCart(updatedCart);
    displayCart();
}

// Llamada inicial para cargar y mostrar el contenido del carrito al cargar la página
displayCart();