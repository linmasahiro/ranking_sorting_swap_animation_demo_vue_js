//////////////////////////////
//
// Ranking Test Helper
//
// Author: k80092@hotmail.com
//
///////////////////////////////

/**
 * Get RankingJSON Data
 *
 * @param String url
 */
 export async function getRankingJsonFile(url) {
    return await new Promise((resolve, reject) => {
        try {
            fetch(url)
                .then((response) => response.json())
                .then((data) => {
                    resolve(data);
                });
        } catch (error) {
            console.log("Fetch error", error);
            reject();
        }
    });
}

/**
 * Change Scores of every streamer (Random)
 * 
 * @param Array  arr
 * @param Number refreshTime
 */
export async function changeRandomScore(arr, refreshTime) {
    return await new Promise((resolve) => {
        let randKey = Math.floor(Math.random() * arr.length);
        let countup = Math.floor(Math.random() * 1000);
        let frame = 0;
        let timer = setInterval(() => {
            frame++;
            let progress = frame / 60;
            arr[randKey].showScore = arr[randKey].score + Math.floor(countup * progress);
            if (progress === 1) {
                clearInterval(timer);
                arr[randKey].score = arr[randKey].showScore;
                resolve(arr);
            }
        }, refreshTime / 60);
    });
}

/**
 * Bubble Sroting
 *
 * @param Array arr
 */
export async function bubbleSort(arr) {
    let tmp;
    return await new Promise((resolve) => {
        for (let i = arr.length - 1; i >= 0; i--) {
            for (let j = i - 1; j >= 0; j--) {
                if (arr[i].score > arr[j].score) {
                    tmp = arr[j];
                    arr[j] = arr[i];
                    arr[i] = tmp;
                }
            }
        }
        resolve(arr);
    });
}

/**
 * Swap animation
 *
 * @param Object target
 * @param Number swapHeight
 * @param Number duration
 */
export function swapElement(target, swapHeight, duration) {
    // if ranking has any changed, swap element.
    requestAnimationFrame(() => {
        // swap the streamerEl to old position
        target.style.transform = "translateY(" + swapHeight + "px)";
        target.style.transition = "transform 0s";
        requestAnimationFrame(() => {
            // swap the streamerEl back to now postion
            target.style.transform = "";
            target.style.transition = "transform " + duration + "ms";
        });
    });
}
