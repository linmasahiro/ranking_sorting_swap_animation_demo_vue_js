<template>
  <div>
    <div
      v-for="(streamer, i) in state.rankingData"
      :key="streamer.userID"
      :ref="
        (el) => {
          state.streamerEl[streamer.userID] = el;
        }
      "
      class="streamer"
    >
      <div class="ranking-no">{{ i + 1 }}</div>
      <div class="picture">
        <img :src="streamer.picture" />
      </div>
      <div class="display-name">{{ streamer.displayName }}</div>
      <div class="score">{{ streamer.showScore }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, onBeforeUpdate } from "vue";
import { getRankingJsonFile, changeRandomScore, bubbleSort, swapElement } from "../helper.js";

// Score refresh duration
const refreshTime = 200;

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    let state = reactive({
      rankingData: [],
      streamerEl: []
    });

    onBeforeUpdate(() => {
      // If update rendering, clear all element ref.
      state.streamerEl = [];
    });

    // Get json file and update ranking data from server
    getRankingJsonFile("./testData.json").then(
      (responseData) => {
        responseData.forEach((data) => {
          data.showScore = data.score;
        });
        state.rankingData = responseData;
      }
    );

    // update score
    setInterval(() => {
      changeRandomScore(state.rankingData, refreshTime).then(() => {
        // bubble sorting after updated score.

        // backup previous element top position
        let prevPosition = [];
        state.rankingData.forEach((streamers) => {
          prevPosition[streamers.userID] = state.streamerEl[
            streamers.userID
          ].getBoundingClientRect().top;
        });
        bubbleSort(state.rankingData).then((sortedData) => {
          // swap position after sorted
          sortedData.forEach((streamers) => {
            let newTop = state.streamerEl[streamers.userID].getBoundingClientRect().top;
            let prevTop = prevPosition[streamers.userID];
            let diffY = prevTop - newTop;
            if (diffY) {
              // swap position after sorted
              swapElement(state.streamerEl[streamers.userID], diffY, refreshTime);
            }
          });
        });
      });
    }, refreshTime);

    return {
      state,
    };
  },
});
</script>

<style scoped>
.streamer {
  font-size: 16px;
  font-family: "Helvetica Neue", Helvetica, Arial, "Microsoft JhengHei", sans-serif;
}

.streamer {
  margin: 0 auto;
  width: 320px;
  height: 48px;
  transition: all 0.3s ease 0s;
  display: flex;
  -webkit-box-align: center;
  align-items: center;
}

.streamer .ranking-no {
  width: 30px;
  text-align: center;
}

.streamer .picture {
  width: 40px;
  text-align: center;
}

.streamer .picture img {
  margin-right: 2em;
  height: 30px;
  width: 30px;
  border-radius: 50%;
}

.streamer .display-name {
  width: 100px;
  text-align: left;
}

.streamer .score {
  width: 150px;
  text-align: right;
}
</style>
