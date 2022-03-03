const mountDOM = (htmlString = "") => {
    const div = document.createElement("div");
    div.innerHTML = htmlString;
    document.body.appendChild(div);

    return div;
};

const cleanupDOM = () => {
    document.body.innerHTML = "";
};

export { cleanupDOM, mountDOM };