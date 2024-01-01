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
  const [contentIndex, setContentIndex] = useState<number>(0);
  const [text, setText] = useState<string>('');
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [typingSpeed, setTypingSpeed] = useState<number | null>(null);

  useEffect(() => {
    setStartTime(null);
    setEndTime(null);
    setTypingSpeed(null);
    setText('');
  }, [contentIndex, data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;

    // Start the timer when the user starts typing
    if (!startTime) {
      setStartTime(new Date());
    }

    setText(inputValue);

    // Check if the entered text matches the current content
    if (inputValue === data[contentIndex]?.content) {
      setEndTime(new Date());
    }
  };

  useEffect(() => {
    // Calculate typing speed when endTime is set
    if (endTime && startTime) {
      const timeDiffInSeconds = (endTime.getTime() - startTime.getTime()) / 1000;
      const wordsTyped = data[contentIndex]?.content.split(' ').length || 0;
      const typingSpeedValue = Math.round((wordsTyped / timeDiffInSeconds) * 60);
      setTypingSpeed(typingSpeedValue);
    }
  }, [endTime, startTime, data, contentIndex]);

  const handleNextContent = () => {
    if (contentIndex < data.length - 1) {
      setContentIndex(contentIndex + 1);
    }
  };

  return (
    <ChakraProvider>
      <Center height="100vh">
        <Box p={8} borderWidth={1} borderRadius="md">
          <Text fontSize="xl" mb={4}>
            Typing Speed Test
          </Text>
          <Text>{data[contentIndex]?.content}</Text>
          <Textarea
            value={text}
            onChange={handleInputChange}
            placeholder="Start typing..."
            rows={3}
            mt={4}
          />
          {typingSpeed && (
            <Box mt={4}>
              <Text>Your typing speed: {typingSpeed} words per minute</Text>
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
