const ScrollTo = (selector) => {
    document.querySelector(selector).scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}

export default ScrollTo