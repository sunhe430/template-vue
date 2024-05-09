import Phaser from 'phaser';

// Used to emit events between Vue components and Phaser scenes
// https://newdocs.phaser.io/docs/3.70.0/Phaser.Events.EventEmitter
export const EventBus = new Phaser.Events.EventEmitter();

// Promise를 반환하는 메서드
export const waitForEvent = (eventName) => {
    return new Promise((resolve) => {
        EventBus.on(eventName, (data) => {
            resolve(data);
        });
    });
};