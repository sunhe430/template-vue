<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { EventBus } from './EventBus';
import gpxFile from '/assets/gpx/mapo.gpx?url';
import gpxParser from 'gpxparser';
import StartGame from './main';

// Save the current scene instance
const scene = ref();
const game = ref();

const emit = defineEmits(['current-active-scene', 'current-distance']);



onMounted(() => {

    game.value = StartGame('game-container');

    EventBus.on('current-scene-ready', (currentScene) => {

        emit('current-active-scene', currentScene);

        scene.value = currentScene;

    });

});
const parseGpx = () => {
    fetch(gpxFile) // GPX 파일 경로
        .then(response => response.text())
        .then(data => {
          // XML 문자열을 파싱하여 JavaScript 객체로 변환
          let parser = new DOMParser();
          var gpx = new gpxParser();
          let xmlDoc = parser.parseFromString(data, 'text/xml');
          console.log('xmlDoc', xmlDoc);
          gpx.parse(data);
          console.log('totalDistance', gpx.tracks[0].distance.cumul);
        })
        .catch(error => {
          console.error('Error fetching or parsing GPX file:', error);
        });
} 
onUnmounted(() => {

    if (game.value)
    {
        game.value.destroy(true);
        game.value = null;
    }
    
});

defineExpose({ scene, game });
</script>

<template>
    <div id="game-container"></div>
</template>