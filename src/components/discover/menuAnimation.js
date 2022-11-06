import anime from "animejs";

const discoverAnimation = (bubble_list, main, current, bubbleToShow, classFactory) => {

    const easing = 'easeInOutQuad';

    anime({
        targets: `.bubble-wrapper-0-child-0 .bubble`,
        scale: 1.2,
        duration: 500,
        easing,
    })

    bubble_list.forEach(element => {

        const class_name = element.id !== 0 ? classFactory(bubbleToShow.find(e => e.id === element.id)) : classFactory(main)

        anime({
            targets: class_name,
            translateX: element.posX,
            translateY: element.posY,
            duration: 500,
            easing,
        })

        anime({
            targets: `${class_name} .bubble`,
            scale: element.scale,
            duration: 500,
            easing,
        })

    })
}

export default discoverAnimation
