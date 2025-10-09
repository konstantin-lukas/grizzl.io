export default function () {
    const isOpen = useState("is-menu-open", () => false);

    function toggle() {
        isOpen.value = !isOpen.value;
    }

    function open() {
        isOpen.value = true;
    }

    function close() {
        isOpen.value = false;
    }

    return { isOpen, toggle, open, close };
}
