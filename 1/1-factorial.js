const nfactorial = function (n) {
    return n > 0 ? n * nfactorial(--n) : 1;
};
