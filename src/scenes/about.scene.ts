export class AboutScene extends Phaser.Scene {

    constructor() {
        super({
            key: "AboutScene"
        });
    }

    preload(): void {
    }

    create(): void {
        this.add.text(40, 40, 'About', {fontFamily: 'Helvetica', fontSize: 32, color: '#333'});
        this.add.text(40, 100, 'TBD', {fontFamily: 'Arial', fontSize: 16, color: '#333'});
    }

    update(time, delta): void {
    }
}
