import { curry, isEmpty } from 'ramda';
import { useState } from 'react';
import { WORDS } from '@/constants';

export type LetterState = 'EMPTY' | 'CORRECT' | 'WRONG' | 'WRONG_POSITION';
export type LetterStateMap = Record<string, LetterState>;

export type WordleGameState = {
  targetWord: string;
  guesses: string[];
  maxAttempts: number;
  currentGuess: string;
  gameOver: boolean;
  wordLength: number;
  message: string;
  letterStates: Array<LetterState[]>;
  letterHistory: LetterStateMap;
};

const getRandomWord = () => {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
};

const newGame = (): WordleGameState => ({
  targetWord: getRandomWord().toUpperCase(),
  guesses: [],
  maxAttempts: 6,
  currentGuess: '',
  gameOver: false,
  wordLength: 5,
  message: '',
  letterStates: [],
  letterHistory: {},
});

const getLetterState = curry(
  (targetWord: string, letter: string, index: number): LetterState => {
    if (isEmpty(letter)) {
      return 'EMPTY';
    }

    if (targetWord?.[index] === letter) {
      return 'CORRECT';
    }

    if (targetWord.includes(letter)) {
      return 'WRONG_POSITION';
    }

    return 'WRONG';
  },
);

const LETTER_STATE_PRIORITY: Record<LetterState, number> = {
  CORRECT: 4,
  WRONG_POSITION: 3,
  WRONG: 2,
  EMPTY: 1,
};

const hasHigherPriority = (a: LetterState, b: LetterState) => {
  return LETTER_STATE_PRIORITY[a] > LETTER_STATE_PRIORITY[b];
};

const computeLetterHistory = (
  targetWord: string,
  guesses: string[],
): LetterStateMap => {
  const stateMap: LetterStateMap = {};

  for (const guess of guesses) {
    for (let i = 0; i < targetWord.length; i++) {
      const letter = guess[i];
      const letterState = getLetterState(targetWord, letter, i);
      if (
        letter in stateMap &&
        !hasHigherPriority(letterState, stateMap[letter])
      ) {
        continue;
      }
      stateMap[letter] = letterState;
    }
  }
  return stateMap;
};

const computeLetterStates = (
  targetWord: string,
  guesses: string[],
): Array<LetterState[]> => {
  return guesses.map((guess) =>
    guess.split('').map((letter, i) => getLetterState(targetWord, letter, i)),
  );
};

export const useWordle = () => {
  const [state, setState] = useState<WordleGameState>(newGame());
  const resetGame = () => setState(newGame());
  const isValidGuess = (guess: string) => guess.length === state.wordLength;
  const hasWon = () => state.currentGuess === state.targetWord;
  const hasLost = () => state.guesses.length + 1 >= state.maxAttempts;

  const makeGuess = (guess: string) => {
    if (!isValidGuess(guess)) return;

    setState((state) => {
      const guesses = [...state.guesses, guess];
      return {
        ...state,
        currentGuess: '',
        guesses,
        letterStates: computeLetterStates(state.targetWord, guesses),
        letterHistory: computeLetterHistory(state.targetWord, guesses),
      };
    });

    if (hasWon()) {
      setState((state) => ({ ...state, gameOver: true, message: 'You won!' }));
      return;
    }

    if (hasLost()) {
      setState((state) => ({ ...state, gameOver: true, message: 'You lost!' }));
    }
  };

  const onKeyPress = (key: string) => {
    switch (key) {
      case 'BACKSPACE':
        setState((state) => ({
          ...state,
          currentGuess: state.currentGuess.slice(0, -1),
        }));
        break;
      case 'ENTER':
        makeGuess(state.currentGuess);
        break;
      default:
        if (state.currentGuess.length >= state.wordLength) return;
        setState((state) => ({
          ...state,
          currentGuess: state.currentGuess + key,
        }));
    }
  };

  return {
    state,
    resetGame,
    onKeyPress,
  };
};
