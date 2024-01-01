import React, { useState, useEffect } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Textarea,
  Button,
  Center,
} from '@chakra-ui/react';
import { data } from './data';

const App: React.FC = () => {
  const [contentIndex, setContentIndex] = useState<number>(getRandomIndex());
  const [text, setText] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [charsTyped, setCharsTyped] = useState<number>(0);
  const [charStatus, setCharStatus] = useState<'white' | 'green' | 'red'[]>([]);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);

  function getRandomIndex() {
    return Math.floor(Math.random() * data.length);
  }

  useEffect(() => {
    setStartTime(null);
    setEndTime(null);
    setText('');
    setIsCorrect(false);
    setCharsTyped(0);
    setCharStatus(new Array(data[contentIndex]?.content.length).fill('white'));
  }, [contentIndex, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Start the timer when the user starts typing
    if (!startTime) {
      setStartTime(new Date());
    }

    setText(inputValue);

    const content = data[contentIndex]?.content || '';
    const charArray = content.split('');
    const typedArray = inputValue.split('');

    // Check correctness for each character
    const newCharStatus :any= charArray.map((char, index) => {
      if (typedArray[index] === char) {
        return 'green';
      } else if (typedArray[index] === '' || typedArray[index] === undefined) {
        return 'white';
      } else {
        return 'red';
      }
    });

    setCharStatus(newCharStatus);

    // Update characters typed count
    setCharsTyped(typedArray.length);

    // Check if the entered text matches the current content
    if (inputValue === content) {
      setEndTime(new Date());
      setIsCorrect(true);
    } else {
      setIsCorrect(false);
    }
  };

  const calculateTypingSpeed = () => {
    if (endTime && startTime) {
      const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
      const typingSpeedValue = Math.round((charsTyped / timeDiffInSeconds) * 60);
      return typingSpeedValue;
    }
    return 0;
  };

  const typingSpeed = calculateTypingSpeed();

  const handleNextContent = () => {
    const randomIndex = getRandomIndex();
    setContentIndex(randomIndex);
  };

  return (
    <ChakraProvider>
      <Center height="100vh" style={{background:"black",color:"white"}}>
        <Box p={8} borderWidth={1} borderRadius="md">
          <Text fontSize="xl" mb={4}>
            Typing Speed Test
          </Text>
          <Text>
            {data[contentIndex]?.content.split('').map((char, index) => (
              <span key={index} style={{ color: charStatus[index] }}>
                {char}
              </span>
            ))}
          </Text>
          <Textarea
            value={text}
            onChange={handleInputChange}
            placeholder="Start typing..."
            rows={3}
            mt={4}
            borderColor={isCorrect ? 'green.500' : 'red.500'}
            borderWidth={2}
            borderRadius="md"
          />
          {typingSpeed > 0 && (
            <Box mt={4}>
              <Text>Your typing speed: {typingSpeed} characters per minute</Text>
              <Button
                mt={4}
                colorScheme="teal"
                onClick={handleNextContent}
              >
                Next
              </Button>
            </Box>
          )}
        </Box>
      </Center>
    </ChakraProvider>
  );
};

export default App;
