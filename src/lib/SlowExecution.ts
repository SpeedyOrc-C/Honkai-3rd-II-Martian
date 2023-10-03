export function slowdown(f: () => void, interval: number): () => void {
    let lastInvokeTime = 0;
    let timeout: number | null = null;

    return function() {
        const thisInvokeTime = Date.now();
        if (thisInvokeTime - lastInvokeTime >= interval) {
            if (!timeout) {
                lastInvokeTime = thisInvokeTime;
                f();
            }
        } else {
            if (!timeout) {
                timeout = setTimeout(() =>
                    {
                        if (timeout) {
                            timeout = null;
                            lastInvokeTime = Date.now();
                            f();
                        }
                    },
                    interval - (thisInvokeTime - lastInvokeTime));
            }
        }
    }
}
