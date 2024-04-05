// Function to shuffle an array
const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const shuffledRandomNumbers = (WALLET_SECRET_KEY) => {
  // Generate an array containing numbers from 1 to 30
  const numbers = Array.from(
    { length: WALLET_SECRET_KEY.length },
    (_, index) => index
  );

  // Shuffle the array
  let shuffledNumbers = shuffleArray(numbers);
  return shuffledNumbers;
};

module.exports = shuffledRandomNumbers;
