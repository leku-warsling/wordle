import { Flex, SimpleGrid, Button } from '@chakra-ui/react';
import { MdOutlineBackspace, MdKeyboardReturn } from 'react-icons/md';
import { LetterStateMap } from '@/hooks/use-wordle';

export type KeyboardProps = {
  onKeyPress: (key: string) => void;
  guess: string;
  limit?: number;
  letterHistory: LetterStateMap;
};

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const getKeyStyleProps = (key: string, letterHistory: LetterStateMap) => {
  const letterState = letterHistory[key];
  switch (letterState) {
    case 'CORRECT':
      return { bg: 'green.600', color: 'white' };
    case 'WRONG_POSITION':
      return { bg: '#b59f3b' };
    case 'WRONG':
      return { bg: 'gray.700', color: 'white' };
    default:
      return {};
  }
};

export const Keyboard = ({
  onKeyPress,
  letterHistory,
  guess,
  limit = 5,
}: KeyboardProps) => {
  return (
    <Flex flexDir="column" gap={6} maxW="350px" w="100%">
      <SimpleGrid columns={6} gap={1}>
        {LETTERS.map((key) => (
          <Button
            key={key}
            fontWeight="bold"
            bg="gray.500"
            h={14}
            onClick={() => onKeyPress(key)}
            {...getKeyStyleProps(key, letterHistory)}
          >
            {key}
          </Button>
        ))}
      </SimpleGrid>
      <Flex w="100%" gap={2}>
        <Button
          size="lg"
          colorPalette="blue"
          onClick={() => onKeyPress('BACKSPACE')}
          flex="auto"
          disabled={guess.length === 0}
        >
          <MdOutlineBackspace />
          BACK
        </Button>
        <Button
          size="lg"
          colorPalette="blue"
          onClick={() => onKeyPress('ENTER')}
          flex="auto"
          disabled={guess.length < limit}
        >
          ENTER
          <MdKeyboardReturn />
        </Button>
      </Flex>
    </Flex>
  );
};
