
const shaderDivs = document.querySelectorAll('.shader');
const loadingPage = document.querySelector('.loading');

shaderDivs.forEach((element, i) => {

    const image = element.querySelector('img');


    imagesLoaded(image, () => {
        const canvas = document.createElement('canvas');
        const sandbox = new GlslCanvas(canvas);

        sandbox.load(rgbImage);

        sandbox.setUniform('image', image.currentSrc);
        sandbox.setUniform('strength', 1.0);

        element.classList.add('loaded')

        element.appendChild(canvas);

        let aimStrength = 0;
        let currenStrength = 0;

        const oberver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.intersectionRatio > 0) {
                    aimStrength = 0;
                } else {
                    aimStrength = 1;
                }
            })
        }, {
            threshold: [0.0, 0.01, 1.0]
        })

        oberver.observe(image);

        function animate() {
            const diff = aimStrength - currenStrength;
            currenStrength += diff * 0.02;

            sandbox.setUniform("strength", currenStrength);

            window.requestAnimationFrame(animate)
        }

        animate();

        //if it's last image remove loader
        if (i === shaderDivs.length - 1) {
            setTimeout(() => loadingPage.remove(), 3000)

        }


        // function sizer() {

        //     console.log('sizer')

        //     const w = image.clientWidth + 200;
        //     const h = image.clientHeight + 200;

        //     canvas.width = w;
        //     canvas.height = h;

        //     canvas.style.width = w + "px";
        //     canvas.style.height = h + "px";

        // }

        // sizer();
        // window.onresize = sizer;

    })

})