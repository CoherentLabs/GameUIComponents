class ComponentSlot extends HTMLElement {
    constructor() {
        super();

        this.originalAppendChild = this.appendChild;
        this.originalInsertBefore = this.insertBefore;
        this.originalReplaceChild = this.replaceChild;
        this.originalRemoveChild = this.removeChild;

        this.appendChild = (node) => {
            const child = this.originalAppendChild(node);
            this.disptachSlotChange(child);

            return child;
        };

        this.insertBefore = (newNode, referenceNode) => {
            const child = this.originalInsertBefore(newNode, referenceNode);
            this.disptachSlotChange(child);

            return child;
        };

        this.replaceChild = (newChild, oldChild) => {
            const replacedNode = this.originalReplaceChild(newChild, oldChild);
            this.disptachSlotChange(replacedNode);

            return replacedNode;
        };

        this.removeChild = (child) => {
            const removedNode = this.originalRemoveChild(child);
            this.disptachSlotChange(removedNode);

            return removedNode;
        };
    }

    disptachSlotChange(child) {
        this.dispatchEvent(new CustomEvent('slotchange'), {
            target: this,
            child: child
        });
    }
}

customElements.define('component-slot', ComponentSlot);

export default ComponentSlot;