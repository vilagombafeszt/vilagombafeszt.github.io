$(document).ready(function() {   
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

    // Smooth scroll to section on menu link click
    $(document).ready(function(){
        $('.menu a').on('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
                    window.location.hash = hash;
                });
            }
        });
    });

    // Smooth scroll to section on square link click
    $(document).ready(function(){
        $('.square a').on('click', function(event) {
            if (this.hash !== "") {
                event.preventDefault();
                var hash = this.hash;
                $('html, body').animate({
                    scrollTop: $(hash).offset().top
                }, 800, function(){
                    window.location.hash = hash;
                });
            }
        });
    });

    // Toggles visibility of the menu links
    function toggleMenu() {
        var menuLinks = document.querySelectorAll('.menu a');
        // Check if any link is visible (i.e., has opacity 1)
        var isVisible = menuLinks[0].style.opacity === '1';

        menuLinks.forEach((link, index) => {
            setTimeout(() => {
                if (isVisible) {
                    // Fade out
                    link.style.opacity = '0'; // Set opacity to 0
                    link.style.transition = 'opacity 0.3s ease'; // Transition for fading out
                    
                    // After fading out, set display to none
                    setTimeout(() => {
                        link.style.display = 'none';
                    }, 400); // Wait for the fade-out transition to complete
                } else {
                    // Fade in
                    link.style.display = 'block'; // Ensure display is block before fading in
                    setTimeout(() => {
                        link.style.opacity = '1'; // Set opacity to 1 to fade in
                        link.style.transition = 'opacity 1.0s ease'; // Transition for fading in
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

    // Function to update the menu image
    function updateMenuImage(imageSrc) {
        console.log("Updating menu image to:", imageSrc);
        $('.menu-btn img').attr('src', imageSrc);
    }


    // Array of image URLs
    const images = [
        "https://albumizr.com/ia/00032a8b1cb5dfafd718135d831ff0f7.jpg",
        "https://albumizr.com/ia/bf3548178b1e21066f2149686ee78426.jpg",
        "https://albumizr.com/ia/be577980de9aeea6e64655d0c1551a02.jpg",
        "https://albumizr.com/ia/117ebfbf398184b0c187605fdeb4baf8.jpg",
        "https://albumizr.com/ia/f9dcbc3ec9c4be9fd479aac6ddd06528.jpg",
        "https://albumizr.com/ia/1301255d4362c93ec6708c5d006bef67.jpg",
        "https://albumizr.com/ia/b90ff5d96b2cffe6dac9777e1b8563dd.jpg",
        "https://albumizr.com/ia/8aa1837c0c7addc6024e82baab77465b.jpg",
        "https://albumizr.com/ia/2d32150e2af212365b33132b88c72ae4.jpg",
        "https://albumizr.com/ia/2b687571a9dce1dfcbb79fd1f76614e0.jpg",
        "https://albumizr.com/ia/ec1ae658a4072c8c59a7829e9dca470d.jpg",
        "https://albumizr.com/ia/801cd5931640ceb0b137e1ecf67458b6.jpg",
        "https://albumizr.com/ia/fdbcf3074cc22f3d42a21e780837d59f.jpg",
        "https://albumizr.com/ia/2791f645970196b3b5662bf8042eec80.jpg",
        "https://albumizr.com/ia/54065c0b3378915db192b67530016b83.jpg",
        "https://albumizr.com/ia/62cd494bbfef76d919eb45ca60cfe7d8.jpg",
        "https://albumizr.com/ia/1088ec07e41c9f247074d0e35ed51e5a.jpg",
        "https://albumizr.com/ia/ced8519b30121183f49ca5f4b98bde81.jpg",
        "https://albumizr.com/ia/734d08be8f7b25dfe91c2130dc0ae810.jpg",
        "https://albumizr.com/ia/2b3d7550d2e6cc9ddf989543e3276a3a.jpg",
        "https://albumizr.com/ia/359990345a9f27fb013b9e69e74feea2.jpg",
        "https://albumizr.com/ia/7f99d38b2e4a75738b6d96c56145154c.jpg",
        "https://albumizr.com/ia/b6f299b128c0b9ca2fd4e571e9794795.jpg",
        "https://albumizr.com/ia/28e040c9bef4e9dd1e65ea75f1f79cc5.jpg",
        "https://albumizr.com/ia/222718a56137cf5b8d8297ac0d97af23.jpg",
        "https://albumizr.com/ia/b57ecacbcc8baec23ca36258da58401b.jpg",
        "https://albumizr.com/ia/6d21ab65b26769f864bdc1612569bfb1.jpg",
        "https://albumizr.com/ia/fe7db0e45d43bcdb54af76da67009702.jpg",
        "https://albumizr.com/ia/83fe316568a2017f32f61ed17d8a4c99.jpg",
        "https://albumizr.com/ia/e2077cebedeaf58d12473654345b2f39.jpg",
        "https://albumizr.com/ia/7aa61a6d73b8813b025783a15ddbf0fc.jpg",
        "https://albumizr.com/ia/6381e04e605f8a94bfbe6daaf5697b91.jpg",
        "https://albumizr.com/ia/1ccf9ece6c71619d31e61808bd2cb276.jpg",
        "https://albumizr.com/ia/609bece20d5a8c3d106cb689df6f80f3.jpg",
        "https://albumizr.com/ia/a21448feac11d4cbe0e796f77ba59590.jpg",
        "https://albumizr.com/ia/55c74ac3b21e28e80c36d9bae1220e8c.jpg",
        "https://albumizr.com/ia/56868ec769df45996d19e34f627a5157.jpg",
        "https://albumizr.com/ia/a933e7f798fbef832a376940cc2ddb4d.jpg",
        "https://albumizr.com/ia/700ce965f6cdb0a5a85937fdb0eda8f8.jpg",
        "https://albumizr.com/ia/6799e72f06a349d66b71704bcff5254f.jpg",
        "https://albumizr.com/ia/0305efca670e07352028ae53dae634cb.jpg",
        "https://albumizr.com/ia/ed174512e38898b1a89919bbccbc26ff.jpg",
        "https://albumizr.com/ia/8363f11f5ba20e8ed558e2ec0d1fb571.jpg",
        "https://albumizr.com/ia/ed198984241bd77b8e53349dfd6e7c27.jpg",
        "https://albumizr.com/ia/fd925b65c20bf230f33c69994fddf78c.jpg",
        "https://albumizr.com/ia/05fe45a6f0e4603ff698175c330fad14.jpg",
        "https://albumizr.com/ia/c44216ea33ac2f477f095662f744aef3.jpg",
        "https://albumizr.com/ia/f6b5f64749a9029fa7a4ef6ff58f23b7.jpg",
        "https://albumizr.com/ia/1e2319bda0ea35b4ec49ad6fcb181b08.jpg",
        "https://albumizr.com/ia/f4f490fcc2c9ba7490de61434b6351c4.jpg",
        "https://albumizr.com/ia/07d0725b8f0a46f5f6cd88aebd2b3ec5.jpg",
        "https://albumizr.com/ia/69ad23e8e16f9a59e199f7aa4fc06dee.jpg",
        "https://albumizr.com/ia/ff98a299b7990b8e9da81feccf95e883.jpg",
        "https://albumizr.com/ia/f8496f9596f049ca404fd5be279a6f15.jpg",
        "https://albumizr.com/ia/de4173828ef92d38e24042e16fcde2b1.jpg",
        "https://albumizr.com/ia/13ab6b449cfdb4841b2e9ff6a5db3912.jpg",
        "https://albumizr.com/ia/07c1f73eb95b4cbcdd3f25b1daf00bbe.jpg",
        "https://albumizr.com/ia/e064a0e040a1343e69c2a83a6ddd81f6.jpg",
        "https://albumizr.com/ia/d8242805cb9b4ebfa52674e2abc7a46a.jpg",
        "https://albumizr.com/ia/31b3ade25a41af8b93e0dbcf51786c89.jpg",
        "https://albumizr.com/ia/e7c12b17a578238ccd87d9aeb290029e.jpg",
        "https://albumizr.com/ia/afe27997e68ac46498369582346b5024.jpg",
        "https://albumizr.com/ia/557c9c69d481521491c16de59ff26260.jpg",
        "https://albumizr.com/ia/444d190667097f8ac7adfe8c7bedfd41.jpg",
        "https://albumizr.com/ia/ee39f527bf48c5d00876319ba621f9c1.jpg",
        "https://albumizr.com/ia/6d736cfa6626c9f2d212e2cc14547cff.jpg",
        "https://albumizr.com/ia/7690e5f4c6a3076d648047eccc01f273.jpg",
        "https://albumizr.com/ia/5b6ebb3471775df5af037f0713b09afb.jpg",
        "https://albumizr.com/ia/bd3bc08397baf3055dcb80191c6a4174.jpg",
        "https://albumizr.com/ia/ad928c0c723b6e107e2b96678d749b2b.jpg",
        "https://albumizr.com/ia/b065255253c7a4567e89c86b8aca3a22.jpg",
        "https://albumizr.com/ia/c271beb884158177c9be192cf4a38431.jpg",
        "https://albumizr.com/ia/d6ebea9a859f3d3a1c373567aa1f0710.jpg",
        "https://albumizr.com/ia/f978dd6adac42bb899b6f50ee53d221f.jpg",
        "https://albumizr.com/ia/a0d863f3b9a39e5e0910e8c9a618e30b.jpg",
        "https://albumizr.com/ia/8c43cfefe29a9629b822c821bbb6030e.jpg",
        "https://albumizr.com/ia/818f482e61881f7b9dae3210c25e3f19.jpg",
        "https://albumizr.com/ia/f6c17e848c37206318be24ba83c34a21.jpg",
        "https://albumizr.com/ia/bb5c717a2652d7af24f6dfa81a6cbb2c.jpg",
        "https://albumizr.com/ia/29c84220d74a5c509332e9e52c9d3d5c.jpg",
        "https://albumizr.com/ia/73b5df4968af89d0dfd37b93509dfd0d.jpg",
        "https://albumizr.com/ia/5e093b4f4d8ec34a59089c1992f5521b.jpg",
        "https://albumizr.com/ia/ebbc8ff6610a88a65a24f6046534143f.jpg",
        "https://albumizr.com/ia/f9e2d059f6cba39499f1d8927e83ffa7.jpg",
        "https://albumizr.com/ia/b8897fd63f7353998eb64b3328ecbd10.jpg",
        "https://albumizr.com/ia/b1fa1b42e11c2ec26c0d69d0d7d332dc.jpg",
        "https://albumizr.com/ia/e3b6a87fac91cff704d5bbff4b23ef62.jpg",
        "https://albumizr.com/ia/062ff3fa5862da21dfa2f28b89845541.jpg",
        "https://albumizr.com/ia/a69b8dd45c550bb6e3bbb56d8beaa8b6.jpg",
        "https://albumizr.com/ia/f7f59de42fc1199547f986c78de50392.jpg",
        "https://albumizr.com/ia/bd1036cbab87f858ca71c399040fa43e.jpg",
        "https://albumizr.com/ia/ab3e660791a1cae8bea066cd41b7042c.jpg",
        "https://albumizr.com/ia/b2259931978eeb4c6bbfac54b1dc21bb.jpg",
        "https://albumizr.com/ia/082ec402f0a32924bbbf94d90c3368ec.jpg",
        "https://albumizr.com/ia/0a432cf73e09d26963e60582e967f878.jpg",
        "https://albumizr.com/ia/408267cc54af739de3154c8e9fe84779.jpg",
        "https://albumizr.com/ia/3f2ab35827342c63b19e4955ca71f0fb.jpg",
        "https://albumizr.com/ia/5bd2e88625add5d606e7afdf823e4aca.jpg",
        "https://albumizr.com/ia/663238947111fa84d18c17cd51077af7.jpg",
        "https://albumizr.com/ia/9f6db97ff53e54e87d249ef7a5508bae.jpg",
        "https://albumizr.com/ia/5f2d8337e4f6f328660a7bd09da8f771.jpg",
        "https://albumizr.com/ia/add21c2be2011cd495a218670128f585.jpg",
        "https://albumizr.com/ia/ec7c124de2e6ee039686e0567385daae.jpg",
        "https://albumizr.com/ia/bc2863c6f2407f53f85d265e7d06dc22.jpg",
        "https://albumizr.com/ia/034752e1402e23ed5daedc7123149a4a.jpg",
        "https://albumizr.com/ia/4a4c161171c87e09b8dc644feb95718f.jpg",
        "https://albumizr.com/ia/836d0a161fc2f02df0f2bc64520aef1f.jpg",
        "https://albumizr.com/ia/2b9a31c98843842ff36fb8f372576f0c.jpg",
        "https://albumizr.com/ia/fce98769eaaf73a7157e419c8a1ee02f.jpg",
        "https://albumizr.com/ia/e6d6f16b0f3d7b600fa9836945a6bb70.jpg",
        "https://albumizr.com/ia/052ef16a2cbba35494fa5e6e0692cb54.jpg",
        "https://albumizr.com/ia/d3f70fd293ea0efb72423ef55acc16a4.jpg",
        "https://albumizr.com/ia/176771fe17373225fd5b9eddd3252a37.jpg"
    ];

    // Function to get a random image
    $(document).ready(function () {
        const randomIndex = Math.floor(Math.random() * images.length);
        $('#randomAlbumImage').attr('src', images[randomIndex]);
    });
});