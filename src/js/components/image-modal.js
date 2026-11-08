export function initImageModal({ trigger, modal, closeButton }) {
    let closeTimeout;
    let previousBodyOverflow = '';

    function close() {
        if (!modal.classList.contains('is-active')) {
            return;
        }

        modal.classList.remove('is-active');
        modal.classList.add('is-closing');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = previousBodyOverflow;

        closeTimeout = setTimeout(() => {
            modal.classList.remove('is-closing');
        }, 500);
    }

    function open() {
        clearTimeout(closeTimeout);
        previousBodyOverflow = document.body.style.overflow;
        modal.classList.remove('is-closing');
        modal.classList.add('is-active');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        closeButton.focus();
    }

    trigger.addEventListener('click', open);
    closeButton.addEventListener('click', close);
    modal.addEventListener('click', event => {
        if (event.target === modal) {
            close();
        }
    });
    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && modal.classList.contains('is-active')) {
            close();
        }
    });

    return { open, close };
}
