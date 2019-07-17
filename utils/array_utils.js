// Shuffle an array through recursion
function getShuffleArray(arr){
    if (arr.length === 1) {
      return arr;
    }
    const rand = Math.floor(Math.random() * arr.length);
    return [arr[rand], ...getShuffleArray(arr.filter((_, i) => i != rand))];
}

export { getShuffleArray };