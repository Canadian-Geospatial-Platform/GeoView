import { api } from '../api/api';
import { EVENT_NAMES } from '../api/event';

/**
 * Apply outline to elements when keyboard is use to navigate
 * Issue in Leaflet... not implemented in the current release: Leaflet/Leaflet#7259
 * Code from: https://github.com/MaxMaeder/keyboardFocus.js
 */
export function manageKeyboardFocus(): void {
    // Remove the 'keyboard-focused' class from any elements that have it
    function removeFocusedClass() {
        const previouslyFocusedElement = document.getElementsByClassName('keyboard-focused')[0];
        if (previouslyFocusedElement) previouslyFocusedElement.classList.toggle('keyboard-focused');
    }

    // Add event listener for when tab pressed
    document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;

        // get array of map elements
        const elements: Element[] = Array.from(document.getElementsByClassName('llwp-map'));
        const activeEl = document.activeElement;

        if (elements.some((element) => element.contains(activeEl))) {
            // Remove class on previous element then add the 'keyboard-focused' class to the currently focused element
            removeFocusedClass();
            activeEl?.classList.toggle('keyboard-focused');

            // Check if the focus element is a map. If so, emit the keyboard focus event with the map id
            if (activeEl?.className.match(/leaflet-map-*/g) !== null) {
                activeEl?.classList.forEach((item) => {
                    if (item.includes('leaflet-map-')) {
                        api.event.emit(EVENT_NAMES.EVENT_MAP_IN_KEYFOCUS, item, {});
                    }
                });
            }
        }
    });

    // Remove the class when the user interacts with the page with their mouse, or when the page looses focus
    document.addEventListener('click', removeFocusedClass);
    document.addEventListener('focusout', removeFocusedClass);
}

/**
 * Validate if a JSON string is well formatted
 * @param {string} str the string to test
 * @returns {bollean} true if the JSON is valid, false otherwise
 */
export function isJsonString(str: string): boolean {
    try {
        if (str !== '') {
            JSON.parse(str);
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
    return true;
}

/**
 * Execute a XMLHttpRequest
 * @param {string} url the url to request
 * @returns {Promise<string>} the return value, return is '{}' if request failed
 */
export function getXMLHttpRequest(url: string): Promise<string> {
    const request = new Promise<string>((resolve) => {
        try {
            const jsonObj = new XMLHttpRequest();
            jsonObj.open('GET', url, true);
            jsonObj.onreadystatechange = () => {
                if (jsonObj.readyState === 4 && jsonObj.status === 200) {
                    resolve(jsonObj.responseText);
                } else if (jsonObj.readyState === 4 && jsonObj.status >= 400) {
                    resolve('{}');
                }
            };
            jsonObj.onerror = () => {
                resolve('{}');
            };
            jsonObj.send(null);
        } catch (error) {
            resolve('{}');
        }
    });

    return request;
}
