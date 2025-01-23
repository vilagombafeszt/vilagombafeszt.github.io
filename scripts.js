document.addEventListener('DOMContentLoaded', function() {
    // Adjusts the href attributes based on window width
    $(window).resize(function() {
        if ($(window).width() >= 700) {
            $('#artists').attr('href', '#Musor');
            $('#tickets').attr('href', '#Jegyeket-berleteket');
            $('#place').attr('href', '#Helyszin');
            $('#story').attr('href', '#Ez-ugy-volt');
            $('#gallery').attr('href', '#Keptar');
            $('#coninfo').attr('href', '#Kapcsolat');
        } else {
            $('#artists').attr('href', '#musor');
            $('#tickets').attr('href', '#jegyeket-berleteket');
            $('#place').attr('href', '#helyszin');
            $('#story').attr('href', '#ez-ugy-volt');
            $('#gallery').attr('href', '#keptar');
            $('#coninfo').attr('href', '#kapcsolat');
        }
    });

    // Adds or removes the 'expandIn' class based on element visibility
    $(window).scroll(function() {
        $('.expandTitle').each(function(){
            var top_of_element = $(this).offset().top;
            var bottom_of_element = $(this).offset().top + $(this).outerHeight();
            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            var top_of_screen = $(window).scrollTop();

            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
                // the element is visible, add the animation class
                $(this).addClass('expandIn');
            } else {
                // the element is not visible, remove the animation class
                $(this).removeClass('expandIn');
            }
        });
    });

    // Adds the 'spinIn' class to the Facebook logo based on its visibility
    $(window).scroll(function() {
        $('#facebook-logo').each(function(){
            var top_of_element = $(this).offset().top;
            var bottom_of_element = $(this).offset().top + $(this).outerHeight();
            var bottom_of_screen = $(window).scrollTop() + $(window).innerHeight();
            var top_of_screen = $(window).scrollTop();

            if ((bottom_of_screen > top_of_element) && (top_of_screen < bottom_of_element)){
                // the element is visible, add the animation class
                $(this).addClass('spinIn');
            } else {
                // the element is not visible, remove the animation class
                $(this).removeClass('spinIn');
            }
        });
    });

    // Updates the menu image based on scroll position
    $(window).scroll(function () {
        var scrollPosition = $(window).scrollTop();

        // Define the offsets for each section
        var otthonOffset = $('#Otthon').offset().top;
        var musorOffset = $('#musor').offset().top;
        var jegyekOffset = $('#jegyeket-berleteket').offset().top - 20;
        var helyszinOffset = $('#helyszin').offset().top - 20;
        var ezugyvoltOffset = $('#ez-ugy-volt').offset().top;
        var keptarOffset = $('#keptar').offset().top - 20;
        var kapcsolatOffset = $('#kapcsolat').offset().top;

        // Check the scroll position and update menu image accordingly
        if (scrollPosition < musorOffset) {
            updateMenuImage('page_images/cimlogo_kek.png');
        } else if (scrollPosition < jegyekOffset) {
            updateMenuImage('page_images/cimlogo_vaj.png');
        } else if (scrollPosition < helyszinOffset) {
            updateMenuImage('page_images/cimlogo_vaj.png');
        } else if (scrollPosition < ezugyvoltOffset) {
            updateMenuImage('page_images/cimlogo_vaj.png');
        } else if (scrollPosition < keptarOffset) {
            updateMenuImage('page_images/cimlogo_vaj.png');
        } else if (scrollPosition < kapcsolatOffset) {
            updateMenuImage('page_images/cimlogo_vaj.png');
        } else {
            updateMenuImage('page_images/cimlogo_kek.png');
        }
    });

    // Smooth scrolling for menu items
    $('.menu a, .square a').on('click', function(event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            var menuHeight = $('.menu').outerHeight();
            $('html, body').animate({
                scrollTop: $(hash).offset().top - menuHeight
            }, 800, function(){
                if(history.pushState) {
                    history.pushState(null, null, hash);
                } else {
                    location.hash = hash;
                }
            });
        }
    });

    // Toggles visibility of the menu links
    function toggleMenu() {
        var menuLinks = document.querySelectorAll('.menu a');
        var isVisible = menuLinks[0].style.opacity === '1';

        menuLinks.forEach((link, index) => {
            setTimeout(() => {
                if (isVisible) {
                    // Fade out
                    link.style.opacity = '0';
                    link.style.transition = 'opacity 0.3s ease';
                    
                    // After fading out, set display to none
                    setTimeout(() => {
                        link.style.display = 'none';
                    }, 400);
                } else {
                    // Fade in
                    link.style.display = 'block';
                    setTimeout(() => {
                        link.style.opacity = '1';
                        link.style.transition = 'opacity 1.0s ease';
                    }, 1); // Slight delay to ensure display is set before fading in
                }
            }, 15 * index);
        });
    }

    // Close menu when a menu item is clicked
    document.querySelectorAll('.menu a').forEach(item => {
        item.addEventListener('click', () => {
            var menuBtn = document.querySelector('.menu-btn');
            if (window.innerWidth <= 600) {
                toggleMenu();
                menuBtn.click();
            }
        });
    });

    // Toggle menu and scroll to section on menu title click
    document.querySelector('.menu').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            var hash = event.target.hash;
            if (window.innerWidth <= 600) {
                toggleMenu();
                event.preventDefault(); // Prevent default link behavior
                document.querySelector(hash).scrollIntoView({ behavior: 'smooth' });
            }
        }
    });

    // Function to update the menu image
    function updateMenuImage(imageSrc) {
        $('.menu-btn img').attr('src', imageSrc);
    }

    $(document).ready(function() {
        // Function to update the menu image with a random picture from the index_pictures folder
        function updateAlbumImage() {
            $.ajax({
                url: 'index_pictures/', // Path to the folder containing images
                success: function(data) {
                    const images = $(data).find('a:contains(".jpg")').map(function() {
                        return $(this).attr('href');
                    }).get();

                    // Select a random image from the list
                    const randomIndex = Math.floor(Math.random() * images.length);

                    // Update the menu image
                    $('.randomAlbumImage').attr('src', images[randomIndex]);
                }
            });
        }
        updateAlbumImage();
    });
});