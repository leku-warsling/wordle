import { MdOutlineRefresh } from 'react-icons/md';
import { Heading, Dialog, Text, Button, Flex } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { Keyboard } from '@components/keyboard';
import { Board } from '@components/board';
import { useWordle } from '@hooks/use-wordle';

export const Game = () => {
  const game = useWordle();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (game.state.gameOver) {
      setShowModal(true);
    }
  }, [game.state.gameOver]);

  return (
    <Flex direction="column" gap={6} justify="center" align="center" py={4}>
      <Heading as="h1" size="2xl" color="white">
        WORDLE
      </Heading>
      <Board
        guesses={game.state.guesses}
        currentGuess={game.state.currentGuess}
        letterStates={game.state.letterStates}
      />
      <Keyboard
        onKeyPress={game.onKeyPress}
        guess={game.state.currentGuess}
        letterHistory={game.state.letterHistory}
      />
      <Dialog.Root open={showModal}>
        <Dialog.Trigger />
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content bg="gray.900" color="white" py={6}>
            <Dialog.CloseTrigger />
            <Dialog.Header justifyContent="center">
              <Dialog.Title fontSize="2xl">{game.state.message}</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body textAlign="center">
              <Text fontWeight={600} fontSize="xl">
                {game.state.targetWord}
              </Text>
            </Dialog.Body>
            <Dialog.Footer justifyContent="center">
              <Button
                size="lg"
                colorPalette="blue"
                variant="solid"
                onClick={() => {
                  setShowModal(false);
                  game.resetGame();
                }}
              >
                Play Again
                <MdOutlineRefresh />
              </Button>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Flex>
  );
};
