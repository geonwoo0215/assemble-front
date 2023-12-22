export default class Component {
    target;
    state;
    constructor(target) {
        this.target = target;
    }
    setup() { }
    template() { return ''; }
    render() {
        this.target.innerHTML = this.template();
    }
    setEvent() { }
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.render();
    }
}