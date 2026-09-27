    /* =========================
       MOBILE MENU
    ========================= */

    const menuButton = document.getElementById("menu-button");
    const mobileMenu = document.getElementById("mobile-menu");

    menuButton.addEventListener("click", () => {
        mobileMenu.classList.toggle("open");

        const icon = menuButton.querySelector("i");

        if (mobileMenu.classList.contains("open")) {
            icon.classList.remove("fa-bars");
            icon.classList.add("fa-xmark");
        } else {
            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");
        }
    });


    document.querySelectorAll("#mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {

            mobileMenu.classList.remove("open");

            const icon = menuButton.querySelector("i");

            icon.classList.remove("fa-xmark");
            icon.classList.add("fa-bars");

        });

    });


    /* =========================
       CONTACT FORM
    ========================= */

    const form = document.getElementById("contact-form");
    const success = document.getElementById("success");

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        success.classList.add("visible");

        form.reset();

        setTimeout(() => {
            success.classList.remove("visible");
        }, 6000);

    });


    /* =========================
       THREE.JS — SCOPE DEVICE
    ========================= */

    const container = document.getElementById("canvas3d");

    if (container && typeof THREE !== "undefined") {

        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            42,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );

        camera.position.set(0, 1.1, 5.5);


        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true
        });

        renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

        renderer.setSize(
            container.clientWidth,
            container.clientHeight
        );

        container.appendChild(renderer.domElement);


        /* Lumière */

        const ambient = new THREE.AmbientLight(
            0xffffff,
            1.5
        );

        scene.add(ambient);


        const light = new THREE.DirectionalLight(
            0xffffff,
            2
        );

        light.position.set(4, 6, 5);

        scene.add(light);


        const sideLight = new THREE.DirectionalLight(
            0x4db3d8,
            1.2
        );

        sideLight.position.set(-4, 2, -3);

        scene.add(sideLight);


        /* Boîtier */

        const device = new THREE.Group();

        scene.add(device);


        const bodyMaterial = new THREE.MeshStandardMaterial({
            color: 0xdfe5e8,
            metalness: 0.65,
            roughness: 0.32
        });


        const body = new THREE.Mesh(
            new THREE.BoxGeometry(3.2, 0.8, 2.5),
            bodyMaterial
        );

        device.add(body);


        /* Plaque supérieure */

        const topMaterial = new THREE.MeshStandardMaterial({
            color: 0xcbd3d8,
            metalness: 0.85,
            roughness: 0.2
        });


        const top = new THREE.Mesh(
            new THREE.BoxGeometry(2.85, 0.08, 2.15),
            topMaterial
        );

        top.position.y = 0.44;

        device.add(top);


        /* Logo sur le dessus */

        const canvas = document.createElement("canvas");

        canvas.width = 1024;
        canvas.height = 1024;

        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#cbd3d8";
        ctx.fillRect(0, 0, 1024, 1024);


        ctx.fillStyle = "#18232d";

        ctx.font = "700 110px Inter, Arial";
        ctx.textAlign = "center";

        ctx.fillText(
            "SCOPE",
            512,
            550
        );


        ctx.font = "500 35px Inter, Arial";

        ctx.fillText(
            "MOBILE SECURITY",
            512,
            620
        );


        const texture = new THREE.CanvasTexture(canvas);


        const logo = new THREE.Mesh(
            new THREE.PlaneGeometry(1.8, 1.8),
            new THREE.MeshBasicMaterial({
                map: texture
            })
        );

        logo.rotation.x = -Math.PI / 2;

        logo.position.y = 0.49;

        device.add(logo);


        /* Vis */

        const screwMaterial = new THREE.MeshStandardMaterial({
            color: 0x27323b,
            metalness: 0.9,
            roughness: 0.25
        });


        const screwPositions = [
            [-1.2, 0.49, -0.9],
            [1.2, 0.49, -0.9],
            [-1.2, 0.49, 0.9],
            [1.2, 0.49, 0.9]
        ];


        screwPositions.forEach(position => {

            const screw = new THREE.Mesh(
                new THREE.CylinderGeometry(
                    0.075,
                    0.075,
                    0.04,
                    6
                ),
                screwMaterial
            );

            screw.position.set(
                position[0],
                position[1],
                position[2]
            );

            device.add(screw);

        });


        /* Ports avant */

        const portMaterial = new THREE.MeshStandardMaterial({
            color: 0x18232d,
            metalness: 0.5,
            roughness: 0.4
        });


        function createPort(x, width, height) {

            const port = new THREE.Mesh(
                new THREE.BoxGeometry(
                    width,
                    height,
                    0.08
                ),
                portMaterial
            );

            port.position.set(
                x,
                -0.08,
                1.28
            );

            device.add(port);

        }


        createPort(-1.05, 0.38, 0.18);
        createPort(-0.5, 0.22, 0.11);
        createPort(0.05, 0.35, 0.15);
        createPort(0.62, 0.38, 0.18);
        createPort(1.13, 0.42, 0.27);


        /* Rotation */

        let dragging = false;

        let previousX = 0;
        let previousY = 0;

        let targetX = 0.35;
        let targetY = -0.6;


        container.addEventListener(
            "pointerdown",
            event => {

                dragging = true;

                previousX = event.clientX;
                previousY = event.clientY;

                container.setPointerCapture(event.pointerId);

            }
        );


        container.addEventListener(
            "pointermove",
            event => {

                if (!dragging) return;

                const deltaX =
                    event.clientX - previousX;

                const deltaY =
                    event.clientY - previousY;


                targetY += deltaX * 0.008;
                targetX += deltaY * 0.008;


                targetX = Math.max(
                    -0.8,
                    Math.min(0.8, targetX)
                );


                previousX = event.clientX;
                previousY = event.clientY;

            }
        );


        container.addEventListener(
            "pointerup",
            () => {
                dragging = false;
            }
        );


        container.addEventListener(
            "pointercancel",
            () => {
                dragging = false;
            }
        );


        /* Animation */

        const clock = new THREE.Clock();

        function animate() {

            requestAnimationFrame(animate);

            const time = clock.getElapsedTime();


            if (!dragging) {
                targetY += 0.002;
            }


            device.rotation.x +=
                (targetX - device.rotation.x) * 0.06;

            device.rotation.y +=
                (targetY - device.rotation.y) * 0.06;


            device.position.y =
                Math.sin(time * 1.2) * 0.035;


            renderer.render(
                scene,
                camera
            );

        }


        animate();


        /* Resize */

        window.addEventListener(
            "resize",
            () => {

                const width =
                    container.clientWidth;

                const height =
                    container.clientHeight;


                camera.aspect =
                    width / height;

                camera.updateProjectionMatrix();


                renderer.setSize(
                    width,
                    height
                );

            }
        );

    }