import React from 'react';
import ReactDOM from 'react-dom';
import LiferayGraph from './LiferayGraph';

class LiferayGraphWebComponent extends HTMLElement {
    connectedCallback() {
        if (!this.querySelector('.react-root')) {
            const reactRoot = document.createElement('div');
            reactRoot.className = 'react-root';
            this.appendChild(reactRoot);
        }

        ReactDOM.render(<LiferayGraph baseURL="http://localhost:8080" />, this.querySelector('.react-root'));
    }

    disconnectedCallback() {
        ReactDOM.unmountComponentAtNode(this.querySelector('.react-root'));
    }
}

const LIFERAY_GRAPH_ELEMENT_ID = 'liferay-graph-cx';

if (!customElements.get(LIFERAY_GRAPH_ELEMENT_ID)) {
    customElements.define(LIFERAY_GRAPH_ELEMENT_ID, LiferayGraphWebComponent);
}
