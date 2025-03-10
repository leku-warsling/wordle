import { isEmpty } from 'ramda';
import { LetterState, LetterStateMap } from '@hooks/use-wordle';
import { Flex } from '@chakra-ui/react';

export type BoardProps = {
  wordLength?: number;
  guesses?: string[];
  maxAttempts?: number;
  currentGuess?: string;
  letterStateMap?: LetterStateMap[];
};

const getLetter = (word: string, index: number) => {
  return word?.[index] || '';
};

const getLetterStyleProps = (state: LetterState) => {
  switch (state) {
    case 'CORRECT':
      return { bg: 'green.600', borderColor: 'green.600', color: 'white' };
    case 'WRONG':
      return { bg: 'gray.600', borderColor: 'gray.600', color: 'white' };
    case 'WRONG_POSITION':
      return { bg: '#b59f3b', borderColor: '#b59f3b' };
    default:
      return {};
  }
};

export const Board = ({
  wordLength = 5,
  guesses = [],
  maxAttempts = 6,
  currentGuess = '',
  letterStateMap = [],
}: BoardProps) => {
  return (
    <Flex flexDir="column" gap={2}>
      {Array.from({ length: maxAttempts }, (_, row) => {
        const guess = guesses?.[row] || '';
        const letterState = letterStateMap?.[row] || {};
        const isCurrentGuessRow = row === guesses.length;

        return (
          <Flex key={row} gap={2}>
            {Array.from({ length: wordLength }, (_, col) => {
              const letter = getLetter(guess, col);
              const hasStyleProps = !isCurrentGuessRow && !isEmpty(letter);

              return (
                <Flex
                  key={`${col}-${letter}`}
                  className={
                    guess
                      ? `animate__animated animate__flipInX animate__delay-${1 * col}s`
                      : undefined
                  }
                  border="2px solid"
                  borderColor="gray"
                  justifyContent="center"
                  alignItems="center"
                  fontWeight="bold"
                  rounded="sm"
                  color="white"
                  w={16}
                  h={16}
                  {...(hasStyleProps
                    ? getLetterStyleProps(letterState?.[letter] || 'EMPTY')
                    : {})}
                >
                  {getLetter(isCurrentGuessRow ? currentGuess : guess, col)}
                </Flex>
              );
            })}
          </Flex>
        );
      })}
    </Flex>
  );
};
