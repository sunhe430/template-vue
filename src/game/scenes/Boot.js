import { Scene } from 'phaser';

export class Boot extends Scene
{
    constructor ()
    {
        super('Boot');
    }

    preload ()
    {
        //  The Boot Scene is typically used to load in any assets you require for your Preloader, such as a game logo or background.
        //  The smaller the file size of the assets, the better, as the Boot Scene itself has no preloader.

        this.load.image('background', 'assets/bg.png');
        this.load.image('background2', 'assets/game.jpg');
        this.load.image('user2', 'assets/user2.png');
        this.load.image('user', 'assets/user.png');
    }

    create ()
    {
        this.scene.start('Preloader');
    }
}
